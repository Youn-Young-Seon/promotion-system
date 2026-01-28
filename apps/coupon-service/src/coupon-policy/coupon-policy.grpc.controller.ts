import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CouponPolicyService } from './coupon-policy.service';
import { CreateCouponPolicyDto } from './dto/create-coupon-policy.dto';

@Controller()
export class CouponPolicyGrpcController {
  constructor(private readonly couponPolicyService: CouponPolicyService) {}

  @GrpcMethod('CouponService', 'CreateCouponPolicy')
  async createCouponPolicy(data: CreateCouponPolicyDto) {
    const policy = await this.couponPolicyService.create(data);
    return {
      policy: {
        id: String(policy.id),
        title: policy.title,
        description: policy.description,
        totalQuantity: policy.totalQuantity,
        issuedQuantity: policy.issuedQuantity,
        startTime: policy.startTime.toISOString(),
        endTime: policy.endTime.toISOString(),
        discountType: policy.discountType,
        discountValue: policy.discountValue,
        minimumOrderAmount: policy.minimumOrderAmount || 0,
        maximumDiscountAmount: policy.maximumDiscountAmount || 0,
        createdAt: policy.createdAt.toISOString(),
      },
    };
  }

  @GrpcMethod('CouponService', 'GetCouponPolicy')
  async getCouponPolicy(data: { id: string | number }) {
    const policyId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
    const policy = await this.couponPolicyService.findById(policyId);
    return {
      policy: {
        id: String(policy.id),
        title: policy.title,
        description: policy.description,
        totalQuantity: policy.totalQuantity,
        issuedQuantity: policy.issuedQuantity,
        startTime: policy.startTime.toISOString(),
        endTime: policy.endTime.toISOString(),
        discountType: policy.discountType,
        discountValue: policy.discountValue,
        minimumOrderAmount: policy.minimumOrderAmount || 0,
        maximumDiscountAmount: policy.maximumDiscountAmount || 0,
        createdAt: policy.createdAt.toISOString(),
      },
    };
  }

  @GrpcMethod('CouponService', 'ListCouponPolicies')
  async listCouponPolicies(data: { page: number; size: number }) {
    const { policies, total } = await this.couponPolicyService.findAll(
      data.page,
      data.size,
    );
    return {
      policies: policies.map((policy) => ({
        id: String(policy.id),
        title: policy.title,
        description: policy.description,
        totalQuantity: policy.totalQuantity,
        issuedQuantity: policy.issuedQuantity,
        startTime: policy.startTime.toISOString(),
        endTime: policy.endTime.toISOString(),
        discountType: policy.discountType,
        discountValue: policy.discountValue,
        minimumOrderAmount: policy.minimumOrderAmount || 0,
        maximumDiscountAmount: policy.maximumDiscountAmount || 0,
        createdAt: policy.createdAt.toISOString(),
      })),
      total,
      page: data.page,
      size: data.size,
    };
  }
}
