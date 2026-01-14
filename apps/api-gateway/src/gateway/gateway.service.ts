import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GatewayService {
    private readonly logger = new Logger(GatewayService.name);

    private readonly serviceUrls = {
        coupon: process.env.COUPON_SERVICE_URL || 'http://localhost:3001',
        point: process.env.POINT_SERVICE_URL || 'http://localhost:3002',
        timesale: process.env.TIMESALE_SERVICE_URL || 'http://localhost:3003',
    };

    async proxyRequest(req: any, res: any, service: 'coupon' | 'point' | 'timesale') {
        const targetUrl = `${this.serviceUrls[service]}${req.url}`;

        this.logger.debug(`Proxying ${req.method} ${req.url} -> ${targetUrl}`);

        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            // 원본 요청의 헤더 복사 (특정 헤더 제외)
            const excludeHeaders = ['host', 'connection', 'content-length'];
            Object.keys(req.headers).forEach((key) => {
                if (!excludeHeaders.includes(key.toLowerCase())) {
                    const value = req.headers[key];
                    if (typeof value === 'string') {
                        headers[key] = value;
                    } else if (Array.isArray(value)) {
                        headers[key] = value[0];
                    }
                }
            });

            const options: RequestInit = {
                method: req.method,
                headers,
            };

            // GET, HEAD 요청이 아닌 경우 body 추가
            if (req.method !== 'GET' && req.method !== 'HEAD') {
                options.body = JSON.stringify(req.body);
            }

            const response = await fetch(targetUrl, options);

            // 응답 헤더 복사
            response.headers.forEach((value, key) => {
                res.setHeader(key, value);
            });

            // 응답 상태 코드 설정
            res.status(response.status);

            // 응답 본문 전달
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                const data = await response.json();
                res.json(data);
            } else {
                const text = await response.text();
                res.send(text);
            }
        } catch (error) {
            this.logger.error(`Proxy error for ${service}: ${error.message}`, error.stack);
            res.status(502).json({
                statusCode: 502,
                message: `Failed to connect to ${service} service`,
                error: 'Bad Gateway',
            });
        }
    }
}
