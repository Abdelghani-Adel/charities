import { Injectable, LoggerService } from "@nestjs/common";

@Injectable()
export class PinoLoggerService implements LoggerService {
  log(message: any, context?: string) {
    this.write("info", message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.write("error", message, context, trace);
  }

  warn(message: any, context?: string) {
    this.write("warn", message, context);
  }

  debug(message: any, context?: string) {
    this.write("debug", message, context);
  }

  verbose(message: any, context?: string) {
    this.write("verbose", message, context);
  }

  private write(level: string, message: any, context?: string, trace?: string) {
    const entry: Record<string, any> = {
      level,
      timestamp: new Date().toISOString(),
      message: typeof message === "string" ? message : JSON.stringify(message),
    };
    if (context) entry.context = context;
    if (trace) entry.trace = trace;
    console.log(JSON.stringify(entry));
  }
}
