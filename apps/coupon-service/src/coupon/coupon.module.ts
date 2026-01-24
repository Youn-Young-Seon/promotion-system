import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponGrpcController } from './coupon.grpc.controller';
import { CouponService } from './coupon.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CouponController, CouponGrpcController],
  providers: [CouponService, PrismaService],
  exports: [CouponService],
})
export class CouponModule {}
