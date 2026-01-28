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
  constructor(private readonly couponService: CouponService) { }

  @GrpcMethod('CouponService', 'IssueCoupon')
  async issueCoupon(data: { userId: string | number; couponPolicyId: string | number }) {
    const userId = typeof data.userId === 'string' ? parseInt(data.userId, 10) : data.userId;
    const couponPolicyId = typeof data.couponPolicyId === 'string' ? parseInt(data.couponPolicyId, 10) : data.couponPolicyId;
    const coupon = await this.couponService.issueCoupon({ userId, couponPolicyId }) as CouponWithPolicy;

    const couponResponse: Record<string, unknown> = {
      id: String(coupon.id),
      userId: String(coupon.userId),
      orderId: String(coupon.orderId || 0),
      status: coupon.status,
      expirationTime: coupon.expirationTime.toISOString(),
      issuedAt: coupon.issuedAt.toISOString(),
    };

    if (coupon.couponPolicy) {
      couponResponse['policy'] = {
        id: String(coupon.couponPolicy.id),
        title: coupon.couponPolicy.title,
        discountType: coupon.couponPolicy.discountType,
        discountValue: coupon.couponPolicy.discountValue,
      };
    }

    return { coupon: couponResponse };
  }

  @GrpcMethod('CouponService', 'UseCoupon')
  async useCoupon(data: { couponId: string | number; orderId: string | number; orderAmount: number }) {
    const couponId = typeof data.couponId === 'string' ? parseInt(data.couponId, 10) : data.couponId;
    const orderId = typeof data.orderId === 'string' ? parseInt(data.orderId, 10) : data.orderId;
    const coupon = await this.couponService.useCoupon(couponId, {
      orderId,
      orderAmount: data.orderAmount,
    });
    return {
      coupon: {
        id: String(coupon.id),
        userId: String(coupon.userId),
        orderId: String(coupon.orderId || 0),
        status: coupon.status,
        expirationTime: coupon.expirationTime.toISOString(),
        issuedAt: coupon.issuedAt.toISOString(),
      },
    };
  }

  @GrpcMethod('CouponService', 'CancelCoupon')
  async cancelCoupon(data: { couponId: string | number }) {
    const couponId = typeof data.couponId === 'string' ? parseInt(data.couponId, 10) : data.couponId;
    const coupon = await this.couponService.cancelCoupon(couponId);
    return {
      coupon: {
        id: String(coupon.id),
        userId: String(coupon.userId),
        orderId: String(coupon.orderId || 0),
        status: coupon.status,
        expirationTime: coupon.expirationTime.toISOString(),
        issuedAt: coupon.issuedAt.toISOString(),
      },
    };
  }

  @GrpcMethod('CouponService', 'GetUserCoupons')
  async getUserCoupons(data: { userId: string | number }) {
    const userId = typeof data.userId === 'string' ? parseInt(data.userId, 10) : data.userId;
    const coupons = await this.couponService.getUserCoupons(userId);
    return {
      coupons: coupons.map((coupon: CouponWithPolicy) => {
        const couponResponse: Record<string, unknown> = {
          id: String(coupon.id),
          userId: String(coupon.userId),
          orderId: String(coupon.orderId || 0),
          status: coupon.status,
          expirationTime: coupon.expirationTime.toISOString(),
          issuedAt: coupon.issuedAt.toISOString(),
        };

        if (coupon.couponPolicy) {
          couponResponse['policy'] = {
            id: String(coupon.couponPolicy.id),
            title: coupon.couponPolicy.title,
            discountType: coupon.couponPolicy.discountType,
            discountValue: coupon.couponPolicy.discountValue,
          };
        }

        return couponResponse;
      }),
    };
  }
}
