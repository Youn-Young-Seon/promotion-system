import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(req: any, res: any, next: any) {
        const { method, originalUrl, ip } = req;
        const userAgent = req.get('user-agent') || '';
        const startTime = Date.now();

        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length');
            const responseTime = Date.now() - startTime;

            const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength || 0}b - ${responseTime}ms - ${ip} ${userAgent}`;

            if (statusCode >= 500) {
                this.logger.error(logMessage);
            } else if (statusCode >= 400) {
                this.logger.warn(logMessage);
            } else {
                this.logger.log(logMessage);
            }
        });

        next();
    }
}
