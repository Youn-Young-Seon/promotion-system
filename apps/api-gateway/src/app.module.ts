import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { DynamicGrpcClientService } from './common/dynamic-grpc-client.service';
import { EtcdModule, LoggerModule, RequestIdMiddleware, HttpLoggerInterceptor } from '@common/index';

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

    // etcd 서비스 디스커버리
    EtcdModule,
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
    DynamicGrpcClientService,
  ],
  exports: [CircuitBreakerService, DynamicGrpcClientService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
