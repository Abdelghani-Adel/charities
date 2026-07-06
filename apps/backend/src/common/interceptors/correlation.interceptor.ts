import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { randomUUID } from "crypto";
import { Request } from "express";

@Injectable()
export class CorrelationInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const correlationId = randomUUID();
    (request as any).correlationId = correlationId;
    return next.handle();
  }
}
