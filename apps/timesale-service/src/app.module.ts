import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisModule, KafkaModule, EtcdModule, LoggerModule, RequestIdMiddleware, HttpLoggerInterceptor, TracingModule } from '@common/index';
import { ProductModule } from './product/product.module';
import { TimeSaleModule } from './timesale/timesale.module';
import { OrderModule } from './order/order.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/timesale-service/.env'],
    }),
    LoggerModule.forRoot({
      serviceName: 'timesale-service',
    }),
    TracingModule,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'timesale_service_',
        },
      },
    }),
    RedisModule,
    KafkaModule,
    EtcdModule,
    ProductModule,
    TimeSaleModule,
    OrderModule,
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
