import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('gateway')
@Controller('health')
export class HealthController {
    private readonly serviceUrls = {
        coupon: process.env.COUPON_SERVICE_URL || 'http://localhost:3001',
        point: process.env.POINT_SERVICE_URL || 'http://localhost:3002',
        timesale: process.env.TIMESALE_SERVICE_URL || 'http://localhost:3003',
    };

    @Get()
    @ApiOperation({ summary: 'Health Check', description: 'API Gateway 및 모든 마이크로서비스의 상태를 확인합니다' })
    @ApiResponse({ status: 200, description: '모든 서비스 정상' })
    @ApiResponse({ status: 503, description: '일부 서비스 비정상' })
    async check() {
        const services = await Promise.all([
            this.checkService('coupon', this.serviceUrls.coupon),
            this.checkService('point', this.serviceUrls.point),
            this.checkService('timesale', this.serviceUrls.timesale),
        ]);

        const allHealthy = services.every(s => s.status === 'up');

        return {
            status: allHealthy ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            gateway: {
                name: 'api-gateway',
                status: 'up',
                port: process.env.GATEWAY_PORT || 4000,
            },
            services,
        };
    }

    private async checkService(name: string, url: string): Promise<{ name: string; status: string; url: string }> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3초 타임아웃

            const response = await fetch(`${url}/api/health`, {
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            return {
                name,
                status: response.ok ? 'up' : 'down',
                url,
            };
        } catch (error) {
            return {
                name,
                status: 'down',
                url,
            };
        }
    }
}
