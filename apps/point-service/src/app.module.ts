import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisModule, KafkaModule, EtcdModule, LoggerModule, RequestIdMiddleware, HttpLoggerInterceptor, TracingModule } from '@common/index';
import { PointModule } from './point/point.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/point-service/.env'],
    }),
    LoggerModule.forRoot({
      serviceName: 'point-service',
    }),
    TracingModule,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'point_service_',
        },
      },
    }),
    RedisModule,
    KafkaModule,
    EtcdModule,
    PointModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
