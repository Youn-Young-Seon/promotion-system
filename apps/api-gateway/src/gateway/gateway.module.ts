import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { RateLimitMiddleware } from '../middleware/rate-limit.middleware';
import { LoggingMiddleware } from '../middleware/logging.middleware';
import { RedisModule } from '@app/common/redis/redis.module';
import { join } from 'path';

@Module({
    imports: [
        RedisModule,
        ClientsModule.register([
            {
                name: 'COUPON_SERVICE',
                transport: Transport.GRPC,
                options: {
                    package: 'coupon',
                    protoPath: join(__dirname, '../../../proto/coupon.proto'),
                    url: process.env.COUPON_GRPC_URL || 'localhost:5001',
                },
            },
            {
                name: 'POINT_SERVICE',
                transport: Transport.GRPC,
                options: {
                    package: 'point',
                    protoPath: join(__dirname, '../../../proto/point.proto'),
                    url: process.env.POINT_GRPC_URL || 'localhost:5002',
                },
            },
            {
                name: 'TIMESALE_SERVICE',
                transport: Transport.GRPC,
                options: {
                    package: 'timesale',
                    protoPath: join(__dirname, '../../../proto/timesale.proto'),
                    url: process.env.TIMESALE_GRPC_URL || 'localhost:5003',
                },
            },
        ]),
    ],
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
