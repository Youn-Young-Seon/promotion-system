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
      id: Number(policy.id),
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
      updatedAt: policy.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('CouponService', 'GetCouponPolicy')
  async getCouponPolicy(data: { id: number }) {
    const policy = await this.couponPolicyService.findOne(data.id);
    return {
      id: Number(policy.id),
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
      updatedAt: policy.updatedAt.toISOString(),
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
        id: Number(policy.id),
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
        updatedAt: policy.updatedAt.toISOString(),
      })),
      total,
    };
  }
}
