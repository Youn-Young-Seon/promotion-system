import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from './logger.service';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 요청 ID 생성 또는 헤더에서 가져오기
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();

    // 응답 헤더에 요청 ID 추가
    res.setHeader('X-Request-ID', requestId);

    // AsyncLocalStorage에 컨텍스트 저장
    const context = {
      requestId,
      method: req.method,
      url: req.url,
      userId: (req as any).user?.userId, // JWT에서 추출된 사용자 ID
    };

    LoggerService.runWithContext(context, () => {
      next();
    });
  }
}
