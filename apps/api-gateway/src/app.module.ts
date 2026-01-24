import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { CouponGatewayModule } from './gateway/coupon/coupon-gateway.module';
import { PointGatewayModule } from './gateway/point/point-gateway.module';
import { TimeSaleGatewayModule } from './gateway/timesale/timesale-gateway.module';
import { CircuitBreakerService } from './common/circuit-breaker.service';
import { join } from 'path';

@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate Limiting (분당 100건)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60초
        limit: 100, // 100건
      },
    ]),

    // Gateway 모듈
    CouponGatewayModule,
    PointGatewayModule,
    TimeSaleGatewayModule,
  ],
  controllers: [AppController],
  providers: [
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
export class AppModule {}
