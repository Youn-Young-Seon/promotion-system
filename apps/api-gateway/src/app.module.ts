import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { CouponPolicyController, CouponController } from './gateway/coupon/coupon-gateway.controller';
import { PointController } from './gateway/point/point-gateway.controller';
import { ProductController, TimeSaleController, OrderController } from './gateway/timesale/timesale-gateway.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CircuitBreakerService } from './common/circuit-breaker.service';
import { LoggerModule, RequestIdMiddleware, HttpLoggerInterceptor, LoggerService } from '@common/index';
import { join } from 'path';

@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 로거 설정
    LoggerModule.forRoot({
      serviceName: 'api-gateway',
    }),

    // Prometheus 모니터링
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'api_gateway_',
        },
      },
    }),

    // Rate Limiting (분당 100건)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60초
        limit: 100, // 100건
      },
    ]),

    // Auth 모듈
    AuthModule,
  ],
  controllers: [
    AppController,
    // Coupon Controllers
    CouponPolicyController,
    CouponController,
    // Point Controller
    PointController,
    // TimeSale Controllers
    ProductController,
    TimeSaleController,
    OrderController,
  ],
  providers: [
    // Global JWT Auth Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global HTTP Logger Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
    CircuitBreakerService,
    // Coupon Service gRPC Client
    {
      provide: 'COUPON_SERVICE',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>(
          'COUPON_SERVICE_HOST',
          'localhost',
        );
        const port = configService.get<number>('COUPON_SERVICE_GRPC_PORT', 50051);

        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'coupon',
            protoPath: join(__dirname, '../../../proto/coupon.proto'),
            url: `${host}:${port}`,
            loader: {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },

    // Point Service gRPC Client
    {
      provide: 'POINT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>(
          'POINT_SERVICE_HOST',
          'localhost',
        );
        const port = configService.get<number>('POINT_SERVICE_GRPC_PORT', 50052);

        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'point',
            protoPath: join(__dirname, '../../../proto/point.proto'),
            url: `${host}:${port}`,
            loader: {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },

    // TimeSale Service gRPC Client
    {
      provide: 'TIMESALE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>(
          'TIMESALE_SERVICE_HOST',
          'localhost',
        );
        const port = configService.get<number>(
          'TIMESALE_SERVICE_GRPC_PORT',
          50053,
        );

        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'timesale',
            protoPath: join(__dirname, '../../../proto/timesale.proto'),
            url: `${host}:${port}`,
            loader: {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [CircuitBreakerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
