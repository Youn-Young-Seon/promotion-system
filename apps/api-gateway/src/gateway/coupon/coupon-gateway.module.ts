import { Module } from '@nestjs/common';
import { CouponPolicyController, CouponController } from './coupon-gateway.controller';

@Module({
  controllers: [CouponPolicyController, CouponController],
})
export class CouponGatewayModule {}
