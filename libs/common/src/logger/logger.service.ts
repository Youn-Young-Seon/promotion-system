import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';
import { createLoggerConfig } from './logger.config';
import { AsyncLocalStorage } from 'async_hooks';

export interface LogContext {
  requestId?: string;
  userId?: string;
  method?: string;
  url?: string;
  [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private context?: string;
  private static asyncLocalStorage = new AsyncLocalStorage<LogContext>();

  constructor(private serviceName: string) {
    this.logger = winston.createLogger(createLoggerConfig(serviceName));
  }

  // 컨텍스트 설정
  setContext(context: string) {
    this.context = context;
    return this;
  }

  // 요청 컨텍스트 저장 (AsyncLocalStorage 사용)
  static runWithContext<T>(context: LogContext, callback: () => T): T {
    return this.asyncLocalStorage.run(context, callback);
  }

  // 현재 요청 컨텍스트 가져오기
  private getContext(): LogContext {
    const context = LoggerService.asyncLocalStorage.getStore() || {};
    if (this.context) {
      context.context = this.context;
    }
    return context;
  }

  // 로그 메서드
  log(message: string, meta?: any) {
    this.logger.info(message, { ...this.getContext(), ...meta });
  }

  error(message: string, trace?: string, meta?: any) {
    this.logger.error(message, {
      ...this.getContext(),
      stack: trace,
      ...meta,
    });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, { ...this.getContext(), ...meta });
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, { ...this.getContext(), ...meta });
  }

  verbose(message: string, meta?: any) {
    this.logger.verbose(message, { ...this.getContext(), ...meta });
  }

  // HTTP 요청 로깅
  logHttpRequest(req: any, res: any, responseTime: number) {
    const { method, url, headers, ip } = req;
    const { statusCode } = res;

    this.logger.info('HTTP Request', {
      ...this.getContext(),
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      ip,
      userAgent: headers['user-agent'],
    });
  }

  // HTTP 에러 로깅
  logHttpError(req: any, error: any, responseTime: number) {
    const { method, url, headers, ip } = req;

    this.logger.error('HTTP Error', {
      ...this.getContext(),
      method,
      url,
      statusCode: error.status || 500,
      responseTime: `${responseTime}ms`,
      ip,
      userAgent: headers['user-agent'],
      error: error.message,
      stack: error.stack,
    });
  }

  // gRPC 요청 로깅
  logGrpcRequest(method: string, meta?: any) {
    this.logger.info('gRPC Request', {
      ...this.getContext(),
      method,
      ...meta,
    });
  }

  // Kafka 이벤트 로깅
  logKafkaEvent(topic: string, event: string, meta?: any) {
    this.logger.info('Kafka Event', {
      ...this.getContext(),
      topic,
      event,
      ...meta,
    });
  }

  // 데이터베이스 쿼리 로깅 (느린 쿼리)
  logSlowQuery(query: string, duration: number, meta?: any) {
    this.logger.warn('Slow Query', {
      ...this.getContext(),
      query,
      duration: `${duration}ms`,
      ...meta,
    });
  }
}
