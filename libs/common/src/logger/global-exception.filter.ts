import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from './logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('GlobalExceptionFilter');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    // 에러 로깅
    const errorLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? { details: exceptionResponse }
        : {}),
    };

    // 5xx 에러는 error 레벨, 4xx는 warn 레벨로 로깅
    if (status >= 500) {
      this.logger.error(
        `Internal Server Error: ${message}`,
        exception instanceof Error ? exception.stack : undefined,
        errorLog,
      );
    } else {
      this.logger.warn(`Client Error: ${message}`, errorLog);
    }

    // 민감한 정보 필터링 (프로덕션 환경)
    const responseBody =
      process.env.NODE_ENV === 'production' && status >= 500
        ? {
            statusCode: status,
            message: 'Internal server error',
            timestamp: new Date().toISOString(),
            path: request.url,
          }
        : {
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(typeof exceptionResponse === 'object' && exceptionResponse !== null
              ? exceptionResponse
              : {}),
          };

    response.status(status).json(responseBody);
  }
}
