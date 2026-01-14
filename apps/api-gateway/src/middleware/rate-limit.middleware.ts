import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { RedisService } from '@app/common/redis/redis.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    private readonly logger = new Logger(RateLimitMiddleware.name);
    private readonly maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
    private readonly windowSeconds = parseInt(process.env.RATE_LIMIT_WINDOW || '60', 10);

    constructor(private readonly redis: RedisService) { }

    async use(req: any, res: any, next: any) {
        // Health check는 rate limit 제외
        if (req.url.includes('/health')) {
            return next();
        }

        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const key = `rate-limit:${ip}`;

        try {
            const count = await this.redis.incr(key);

            if (count === 1) {
                await this.redis.expire(key, this.windowSeconds);
            }

            // Rate limit 헤더 추가
            res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
            res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - count).toString());

            if (count > this.maxRequests) {
                this.logger.warn(`Rate limit exceeded for IP: ${ip} (${count} requests)`);
                return res.status(429).json({
                    statusCode: 429,
                    message: 'Too Many Requests',
                    error: 'Rate Limit Exceeded',
                    retryAfter: this.windowSeconds,
                });
            }

            next();
        } catch (error) {
            this.logger.error(`Rate limit check failed: ${error.message}`);
            // Redis 오류 시 rate limit 우회
            next();
        }
    }
}
