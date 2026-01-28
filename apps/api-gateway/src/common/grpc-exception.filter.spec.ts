import { GrpcExceptionFilter } from './grpc-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

describe('GrpcExceptionFilter', () => {
  let filter: GrpcExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new GrpcExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/test-url',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('HttpException handling', () => {
    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        { message: 'Test error', error: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Test error',
        error: 'Bad Request',
      });
    });

    it('should handle HttpException with string response', () => {
      const exception = new HttpException('Test error message', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Test error message',
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });
  });

  describe('gRPC error handling', () => {
    it('should map gRPC NOT_FOUND (5) to HTTP NOT_FOUND', () => {
      const grpcError = {
        code: 5,
        details: 'Resource not found',
        message: 'Not found',
      };

      filter.catch(grpcError, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'The requested resource was not found.',
        details: 'Resource not found',
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });

    it('should map gRPC INVALID_ARGUMENT (3) to HTTP BAD_REQUEST', () => {
      const grpcError = {
        code: 3,
        details: 'Invalid parameters',
        message: 'Invalid argument',
      };

      filter.catch(grpcError, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid request parameters.',
        details: 'Invalid parameters',
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });

    it('should map gRPC UNAVAILABLE (14) to HTTP SERVICE_UNAVAILABLE', () => {
      const grpcError = {
        code: 14,
        details: 'Service unavailable',
        message: 'Unavailable',
      };

      filter.catch(grpcError, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Service temporarily unavailable. Please try again later.',
        details: 'Service unavailable',
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });

    it('should map gRPC UNAUTHENTICATED (16) to HTTP UNAUTHORIZED', () => {
      const grpcError = {
        code: 16,
        details: 'Not authenticated',
        message: 'Unauthenticated',
      };

      filter.catch(grpcError, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authentication required.',
        details: 'Not authenticated',
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });

    it('should handle gRPC connection error', () => {
      const grpcError = {
        code: 14,
        details: 'No connection established',
        message: 'Unavailable',
      };

      filter.catch(grpcError, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Service is not available. The backend service may be starting up or temporarily down.',
        details: 'No connection established',
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });
  });

  describe('gRPC-related Error handling', () => {
    it('should handle gRPC client not found error', () => {
      const error = new Error('gRPC client not found for service: test-service');

      filter.catch(error, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Service temporarily unavailable. Please try again later.',
        details: 'gRPC client not found for service: test-service',
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });

    it('should handle other gRPC-related errors', () => {
      const error = new Error('gRPC call failed');

      filter.catch(error, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'gRPC call failed',
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });
  });

  describe('General error handling', () => {
    it('should handle generic Error objects', () => {
      const error = new Error('Generic error');

      filter.catch(error, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Generic error',
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });
  });

  describe('gRPC code mapping', () => {
    const testCases = [
      { code: 1, expected: HttpStatus.REQUEST_TIMEOUT, name: 'CANCELLED' },
      { code: 2, expected: HttpStatus.INTERNAL_SERVER_ERROR, name: 'UNKNOWN' },
      { code: 4, expected: HttpStatus.REQUEST_TIMEOUT, name: 'DEADLINE_EXCEEDED' },
      { code: 6, expected: HttpStatus.CONFLICT, name: 'ALREADY_EXISTS' },
      { code: 7, expected: HttpStatus.FORBIDDEN, name: 'PERMISSION_DENIED' },
      { code: 8, expected: HttpStatus.TOO_MANY_REQUESTS, name: 'RESOURCE_EXHAUSTED' },
      { code: 9, expected: HttpStatus.PRECONDITION_FAILED, name: 'FAILED_PRECONDITION' },
      { code: 10, expected: HttpStatus.CONFLICT, name: 'ABORTED' },
      { code: 11, expected: HttpStatus.BAD_REQUEST, name: 'OUT_OF_RANGE' },
      { code: 12, expected: HttpStatus.NOT_IMPLEMENTED, name: 'UNIMPLEMENTED' },
      { code: 13, expected: HttpStatus.INTERNAL_SERVER_ERROR, name: 'INTERNAL' },
      { code: 15, expected: HttpStatus.INTERNAL_SERVER_ERROR, name: 'DATA_LOSS' },
    ];

    testCases.forEach(({ code, expected, name }) => {
      it(`should map gRPC ${name} (${code}) to HTTP ${expected}`, () => {
        const grpcError = {
          code,
          details: `Test ${name}`,
          message: name,
        };

        filter.catch(grpcError, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(expected);
      });
    });

    it('should map unknown gRPC code to INTERNAL_SERVER_ERROR', () => {
      const grpcError = {
        code: 999,
        details: 'Unknown error',
        message: 'Unknown',
      };

      filter.catch(grpcError, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
