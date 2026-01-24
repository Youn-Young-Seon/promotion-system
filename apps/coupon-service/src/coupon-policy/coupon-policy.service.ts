import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponPolicyDto } from './dto';
import { CouponPolicy } from '../../prisma/generated/client';

@Injectable()
export class CouponPolicyService {
  private readonly logger = new Logger(CouponPolicyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCouponPolicyDto): Promise<CouponPolicy> {
    this.logger.log(`Creating coupon policy: ${dto.title}`);

    const policy = await this.prisma.couponPolicy.create({
      data: {
        title: dto.title,
        description: dto.description,
        totalQuantity: dto.totalQuantity,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        minimumOrderAmount: dto.minimumOrderAmount,
        maximumDiscountAmount: dto.maximumDiscountAmount,
      },
    });

    this.logger.log(`Coupon policy created: ${policy.id}`);
    return policy;
  }

  async findById(id: number): Promise<CouponPolicy> {
    const policy = await this.prisma.couponPolicy.findUnique({
      where: { id: BigInt(id) },
      include: {
        coupons: {
          take: 10,
          orderBy: { issuedAt: 'desc' },
        },
      },
    });

    if (!policy) {
      throw new NotFoundException(`Coupon policy with ID ${id} not found`);
    }

    return policy;
  }

  async findAll(page = 0, size = 10): Promise<{ policies: CouponPolicy[]; total: number }> {
    const [policies, total] = await Promise.all([
      this.prisma.couponPolicy.findMany({
        skip: page * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.couponPolicy.count(),
    ]);

    return { policies, total };
  }
}
