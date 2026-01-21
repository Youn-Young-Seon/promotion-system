import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponGrpcController } from './coupon.grpc.controller';
import { CouponService } from './coupon.service';
import { PrismaService } from '../prisma/prisma.service';
import { IssueCouponV1Strategy, IssueCouponV2Strategy, IssueCouponV3Strategy } from './strategies';

@Module({
    controllers: [CouponController, CouponGrpcController],
    providers: [
        CouponService,
        PrismaService,
        // Strategy Pattern: Register all coupon issuance strategies
        IssueCouponV1Strategy,
        IssueCouponV2Strategy,
        IssueCouponV3Strategy,
    ],
})
export class CouponModule { }
