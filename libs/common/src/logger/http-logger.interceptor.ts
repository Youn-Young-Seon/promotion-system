import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        this.logger.logHttpRequest(request, response, responseTime);
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        this.logger.logHttpError(request, error, responseTime);
        throw error;
      }),
    );
  }
}
