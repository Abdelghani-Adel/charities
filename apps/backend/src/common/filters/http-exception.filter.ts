import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { I18nContext } from "nestjs-i18n";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const i18n = I18nContext.current();

    const correlationId = (request as any).correlationId ?? randomUUID();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = "INTERNAL_ERROR";
    let message = "An unexpected error occurred";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === "string" ? res : (res as any).message ?? message;

      if (status === 400) code = "VALIDATION_ERROR";
      else if (status === 401) code = "UNAUTHORIZED";
      else if (status === 403) code = "FORBIDDEN";
      else if (status === 404) code = "NOT_FOUND";
      else if (status === 409) code = "CONFLICT";
      else if (status === 422) code = "VALIDATION_ERROR";
      else if (status === 423) code = "LOCKED";
      else if (status === 429) code = "RATE_LIMITED";
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR && i18n) {
      message = i18n.t("auth.server_error");
    }

    console.error(`[${correlationId}] ${status} ${request.method} ${request.url}:`, exception);

    response.status(status).json({
      status: "error",
      message,
      code,
      correlationId,
    });
  }
}
