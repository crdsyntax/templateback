import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { HttpLoggerService } from "../services/http-logger.service";

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");
  private readonly methodsToLog = ["POST", "PATCH", "PUT", "DELETE"];

  constructor(private readonly httpLoggerService: HttpLoggerService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const method = request.method;

    if (!this.methodsToLog.includes(method)) {
      return next();
    }

    const start = Date.now();
    let logId: string;

    try {
      logId = await this.httpLoggerService.logRequest(request);

      response.on("finish", async () => {
        try {
          const { statusCode } = response;
          const contentLength = response.get("content-length") || "0";
          const responseTime = Date.now() - start;
          const isError = statusCode >= 400;

          await this.httpLoggerService.updateLog(logId, {
            statusCode,
            contentLength,
            responseTime,
            isError,
            ...(isError && {
              errorMessage: response.statusMessage,
              errorStack: response.locals.error?.stack,
            }),
          });

          this.logger.log(
            `[${logId}] ${method} ${request.originalUrl} ${statusCode} ${responseTime}ms`
          );
        } catch (error) {
          this.logger.error("Error updating request log:", error);
        }
      });

      response.on("error", async (error) => {
        try {
          await this.httpLoggerService.updateLog(logId, {
            isError: true,
            errorMessage: error.message,
            errorStack: error.stack,
          });
        } catch (updateError) {
          this.logger.error("Error updating error log:", updateError);
        }
      });

      next();
    } catch (error) {
      this.logger.error("Error in HTTP logger middleware:", error);
      next();
    }
  }
}
