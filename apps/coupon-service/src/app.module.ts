import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule, KafkaModule } from '@common/index';
import { CouponPolicyModule } from './coupon-policy/coupon-policy.module';
import { CouponModule } from './coupon/coupon.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
    KafkaModule,
    CouponPolicyModule,
    CouponModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
