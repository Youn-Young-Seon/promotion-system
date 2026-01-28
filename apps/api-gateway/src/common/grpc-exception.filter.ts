import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // NestJS HttpException은 그대로 전달 (기본 처리 사용)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      response.status(status).json(
        typeof exceptionResponse === 'object'
          ? exceptionResponse
          : {
              statusCode: status,
              message: exceptionResponse,
              timestamp: new Date().toISOString(),
              path: request.url,
            },
      );
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: string | undefined;

    // gRPC 에러 처리
    if (this.isGrpcError(exception)) {
      const grpcError = exception as { code: number; details: string; message: string };

      this.logger.error(
        `gRPC Error: code=${grpcError.code}, details=${grpcError.details}, message=${grpcError.message}`,
      );

      // gRPC 에러 코드를 HTTP 상태 코드로 매핑
      status = this.mapGrpcCodeToHttpStatus(grpcError.code);
      message = this.mapGrpcMessage(grpcError);
      details = grpcError.details;
    }
    // 일반 Error 객체 처리 (gRPC 관련만)
    else if (exception instanceof Error && this.isGrpcRelatedError(exception)) {
      this.logger.error(`gRPC-related Error: ${exception.message}`, exception.stack);

      // gRPC client not found 에러
      if (exception.message.includes('gRPC client not found')) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Service temporarily unavailable. Please try again later.';
        details = exception.message;
      } else {
        message = exception.message;
      }
    }
    // 기타 에러는 다시 throw (다른 필터가 처리하도록)
    else {
      this.logger.error(`Non-gRPC error: ${exception instanceof Error ? exception.message : JSON.stringify(exception)}`);

      if (exception instanceof Error) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = exception.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private isGrpcRelatedError(error: Error): boolean {
    const grpcKeywords = [
      'gRPC',
      'grpc',
      'ClientGrpc',
      'microservice',
      'RpcException',
    ];
    return grpcKeywords.some((keyword) => error.message.includes(keyword));
  }

  private isGrpcError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      'details' in exception
    );
  }

  private mapGrpcCodeToHttpStatus(grpcCode: number): HttpStatus {
    // gRPC 상태 코드: https://grpc.github.io/grpc/core/md_doc_statuscodes.html
    switch (grpcCode) {
      case 1: // CANCELLED
        return HttpStatus.REQUEST_TIMEOUT;
      case 2: // UNKNOWN
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case 3: // INVALID_ARGUMENT
        return HttpStatus.BAD_REQUEST;
      case 4: // DEADLINE_EXCEEDED
        return HttpStatus.REQUEST_TIMEOUT;
      case 5: // NOT_FOUND
        return HttpStatus.NOT_FOUND;
      case 6: // ALREADY_EXISTS
        return HttpStatus.CONFLICT;
      case 7: // PERMISSION_DENIED
        return HttpStatus.FORBIDDEN;
      case 8: // RESOURCE_EXHAUSTED
        return HttpStatus.TOO_MANY_REQUESTS;
      case 9: // FAILED_PRECONDITION
        return HttpStatus.PRECONDITION_FAILED;
      case 10: // ABORTED
        return HttpStatus.CONFLICT;
      case 11: // OUT_OF_RANGE
        return HttpStatus.BAD_REQUEST;
      case 12: // UNIMPLEMENTED
        return HttpStatus.NOT_IMPLEMENTED;
      case 13: // INTERNAL
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case 14: // UNAVAILABLE
        return HttpStatus.SERVICE_UNAVAILABLE;
      case 15: // DATA_LOSS
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case 16: // UNAUTHENTICATED
        return HttpStatus.UNAUTHORIZED;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private mapGrpcMessage(grpcError: { code: number; details: string; message: string }): string {
    // 서비스 발견 실패
    if (grpcError.details?.includes('No connection established')) {
      return 'Service is not available. The backend service may be starting up or temporarily down.';
    }

    // 기타 gRPC 에러
    switch (grpcError.code) {
      case 14: // UNAVAILABLE
        return 'Service temporarily unavailable. Please try again later.';
      case 5: // NOT_FOUND
        return 'The requested resource was not found.';
      case 3: // INVALID_ARGUMENT
        return 'Invalid request parameters.';
      case 16: // UNAUTHENTICATED
        return 'Authentication required.';
      case 7: // PERMISSION_DENIED
        return 'Permission denied.';
      default:
        return grpcError.message || 'An error occurred while processing your request.';
    }
  }
}
