import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { randomUUID } from "crypto";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = (request as any).correlationId ?? randomUUID();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = "INTERNAL_ERROR";
    let message = "An unexpected error occurred";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === "string" ? res : (res as any).message ?? message;

      switch (status) {
        case 400: code = "VALIDATION_ERROR"; break;
        case 401: code = "UNAUTHORIZED"; break;
        case 403: code = "FORBIDDEN"; break;
        case 404: code = "NOT_FOUND"; break;
        case 409: code = "CONFLICT"; break;
        case 422: code = "VALIDATION_ERROR"; break;
        case 429: code = "RATE_LIMITED"; break;
      }
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
