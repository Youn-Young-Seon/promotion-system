import { Module } from '@nestjs/common';
import { CouponPolicyController } from './coupon-policy.controller';
import { CouponPolicyGrpcController } from './coupon-policy.grpc.controller';
import { CouponPolicyService } from './coupon-policy.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CouponPolicyController, CouponPolicyGrpcController],
  providers: [CouponPolicyService, PrismaService],
  exports: [CouponPolicyService],
})
export class CouponPolicyModule {}
