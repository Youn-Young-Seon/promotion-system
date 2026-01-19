import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CouponService } from './coupon.service';
import { DiscountType } from './dto';

interface CreatePolicyRequest {
    title: string;
    description: string;
    totalQuantity: number;
    startTime: string;
    endTime: string;
    discountType: string;
    discountValue: number;
    minimumOrderAmount: number;
    maximumDiscountAmount: number;
}

interface IssueCouponRequest {
    userId: string;
    couponPolicyId: string;
    strategy?: string;
}

interface UseCouponRequest {
    couponId: string;
    orderId: string;
}

interface GetUserCouponsRequest {
    userId: string;
}

@Controller()
export class CouponGrpcController {
    constructor(private readonly couponService: CouponService) { }

    @GrpcMethod('CouponService', 'CreatePolicy')
    async createPolicy(data: CreatePolicyRequest) {
        const dto = {
            title: data.title,
            description: data.description,
            totalQuantity: data.totalQuantity,
            startTime: data.startTime,
            endTime: data.endTime,
            discountType: data.discountType as DiscountType,
            discountValue: data.discountValue,
            minimumOrderAmount: data.minimumOrderAmount,
            maximumDiscountAmount: data.maximumDiscountAmount,
        };

        const result = await this.couponService.createPolicy(dto);

        return {
            id: result.id,
            title: result.title,
            totalQuantity: result.totalQuantity,
            startTime: result.createdAt.toISOString(),
            endTime: result.createdAt.toISOString(),
            discountType: data.discountType,
            discountValue: data.discountValue,
            minimumOrderAmount: data.minimumOrderAmount,
            maximumDiscountAmount: data.maximumDiscountAmount,
        };
    }

    @GrpcMethod('CouponService', 'IssueCoupon')
    async issueCoupon(data: IssueCouponRequest) {
        const dto = {
            policyId: data.couponPolicyId,
            userId: data.userId,
        };

        const result = await this.couponService.issueCoupon(dto, data.strategy || 'v1');

        // V3 returns different structure (PENDING status)
        if ('message' in result && result.status === 'PENDING') {
            return {
                id: '',
                couponPolicyId: result.policyId,
                userId: result.userId,
                status: result.status,
                expirationTime: '',
                issuedAt: '',
            };
        }

        // V1 and V2 return coupon object
        return {
            id: result.id,
            couponPolicyId: result.couponPolicyId,
            userId: result.userId,
            status: result.status,
            expirationTime: result.expirationTime.toISOString(),
            issuedAt: result.issuedAt.toISOString(),
        };
    }

    @GrpcMethod('CouponService', 'UseCoupon')
    async useCoupon(data: UseCouponRequest) {
        const result = await this.couponService.useCoupon(
            BigInt(data.couponId),
            BigInt(data.orderId)
        );

        return {
            success: true,
            message: 'Coupon used successfully',
            discountAmount: result.discountValue || 0,
        };
    }

    @GrpcMethod('CouponService', 'GetUserCoupons')
    async getUserCoupons(data: GetUserCouponsRequest) {
        const result = await this.couponService.getUserCoupons(BigInt(data.userId));

        return {
            coupons: result.coupons.map(coupon => ({
                id: coupon.id,
                couponPolicyId: '',
                userId: data.userId,
                orderId: '',
                status: coupon.status,
                expirationTime: coupon.expirationTime.toISOString(),
                issuedAt: '',
            })),
        };
    }
}
