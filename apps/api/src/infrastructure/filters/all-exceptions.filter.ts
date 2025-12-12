import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus: HttpStatus;
    let message: string | object;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      httpStatus = status;
      message = exception.getResponse();
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    // Log to Console
    this.logger.error(
      `Exception: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    // Send to Sentry if it's an internal error or critical
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      Sentry.captureException(exception);
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest<object>()) as string,
      message:
        typeof message === 'object' && message !== null && 'message' in message
          ? (message as { message: string }).message
          : (message as string),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
