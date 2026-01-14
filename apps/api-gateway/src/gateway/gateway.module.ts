import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { RateLimitMiddleware } from '../middleware/rate-limit.middleware';
import { LoggingMiddleware } from '../middleware/logging.middleware';
import { RedisModule } from '@app/common/redis/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [GatewayController],
    providers: [GatewayService],
})
export class GatewayModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggingMiddleware, RateLimitMiddleware)
            .forRoutes('*');
    }
}
