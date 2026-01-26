import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CouponService } from './coupon.service';
import { Coupon } from '../../prisma/generated/client';

type CouponWithPolicy = Coupon & {
  couponPolicy?: {
    id: bigint;
    title: string;
    discountType: string;
    discountValue: number;
  } | null;
};

@Controller()
export class CouponGrpcController {
  constructor(private readonly couponService: CouponService) {}

  @GrpcMethod('CouponService', 'IssueCoupon')
  async issueCoupon(data: { userId: number; couponPolicyId: number }) {
    const coupon = await this.couponService.issueCoupon(data) as CouponWithPolicy;
    return {
      id: Number(coupon.id),
      userId: String(coupon.userId),
      couponPolicyId: Number(coupon.couponPolicyId),
      status: coupon.status,
      expirationTime: coupon.expirationTime.toISOString(),
      issuedAt: coupon.issuedAt.toISOString(),
      usedAt: coupon.usedAt?.toISOString() || '',
      orderId: coupon.orderId ? String(coupon.orderId) : '',
      couponPolicy: coupon.couponPolicy
        ? {
            id: Number(coupon.couponPolicy.id),
            title: coupon.couponPolicy.title,
            discountType: coupon.couponPolicy.discountType,
            discountValue: coupon.couponPolicy.discountValue,
          }
        : undefined,
    };
  }

  @GrpcMethod('CouponService', 'UseCoupon')
  async useCoupon(data: { id: number; orderId: number; orderAmount: number }) {
    const coupon = await this.couponService.useCoupon(data.id, {
      orderId: data.orderId,
      orderAmount: data.orderAmount,
    });
    return {
      id: Number(coupon.id),
      userId: String(coupon.userId),
      couponPolicyId: Number(coupon.couponPolicyId),
      status: coupon.status,
      expirationTime: coupon.expirationTime.toISOString(),
      issuedAt: coupon.issuedAt.toISOString(),
      usedAt: coupon.usedAt?.toISOString() || '',
      orderId: coupon.orderId ? String(coupon.orderId) : '',
    };
  }

  @GrpcMethod('CouponService', 'CancelCoupon')
  async cancelCoupon(data: { id: number }) {
    const coupon = await this.couponService.cancelCoupon(data.id);
    return {
      id: Number(coupon.id),
      userId: String(coupon.userId),
      couponPolicyId: Number(coupon.couponPolicyId),
      status: coupon.status,
      expirationTime: coupon.expirationTime.toISOString(),
      issuedAt: coupon.issuedAt.toISOString(),
      usedAt: coupon.usedAt?.toISOString() || '',
      orderId: coupon.orderId ? String(coupon.orderId) : '',
    };
  }

  @GrpcMethod('CouponService', 'GetUserCoupons')
  async getUserCoupons(data: { userId: number }) {
    const coupons = await this.couponService.getUserCoupons(data.userId);
    return {
      coupons: coupons.map((coupon: CouponWithPolicy) => ({
        id: Number(coupon.id),
        userId: String(coupon.userId),
        couponPolicyId: Number(coupon.couponPolicyId),
        status: coupon.status,
        expirationTime: coupon.expirationTime.toISOString(),
        issuedAt: coupon.issuedAt.toISOString(),
        usedAt: coupon.usedAt?.toISOString() || '',
        orderId: coupon.orderId ? String(coupon.orderId) : '',
        couponPolicy: coupon.couponPolicy
          ? {
              id: Number(coupon.couponPolicy.id),
              title: coupon.couponPolicy.title,
              discountType: coupon.couponPolicy.discountType,
              discountValue: coupon.couponPolicy.discountValue,
            }
          : undefined,
      })),
    };
  }
}
