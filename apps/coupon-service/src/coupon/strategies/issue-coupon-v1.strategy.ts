import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IssueCouponStrategy } from './issue-coupon-strategy.interface';
import { IssueCouponResponse } from '../dto';

/**
 * V1 Strategy: Database-based coupon issuance with transactions
 *
 * Performance: ~100 TPS
 * Features:
 * - Database transactions for consistency
 * - Simple and reliable
 * - Strong consistency guarantee
 *
 * Best for: Development, testing, audit requirements
 */
@Injectable()
export class IssueCouponV1Strategy implements IssueCouponStrategy {
    private readonly logger = new Logger(IssueCouponV1Strategy.name);

    constructor(private readonly prisma: PrismaService) {}

    async execute(policyId: bigint, userId: bigint): Promise<IssueCouponResponse> {
        this.logger.log(`V1 Strategy - Issuing coupon: policyId=${policyId}, userId=${userId}`);

        const coupon = await this.prisma.$transaction(async (tx) => {
            const policy = await tx.couponPolicy.findUnique({
                where: { id: policyId },
            });

            if (!policy) {
                throw new NotFoundException('쿠폰 정책을 찾을 수 없습니다');
            }

            const now = new Date();
            if (now < policy.startTime || now > policy.endTime) {
                throw new BadRequestException('쿠폰 발급 가능 시간이 아닙니다');
            }

            const issuedCount = await tx.coupon.count({
                where: { couponPolicyId: policyId },
            });

            if (issuedCount >= policy.totalQuantity) {
                throw new BadRequestException('쿠폰이 모두 소진되었습니다');
            }

            const existingCoupon = await tx.coupon.findFirst({
                where: {
                    couponPolicyId: policyId,
                    userId: userId,
                },
            });

            if (existingCoupon) {
                throw new BadRequestException('이미 발급받은 쿠폰입니다');
            }

            const expirationTime = new Date(policy.endTime);
            expirationTime.setDate(expirationTime.getDate() + 30);

            const coupon = await tx.coupon.create({
                data: {
                    couponPolicyId: policyId,
                    userId: userId,
                    status: 'AVAILABLE',
                    expirationTime,
                },
            });

            return coupon;
        });

        this.logger.log(`V1 Strategy - Coupon issued: couponId=${coupon.id}`);

        return {
            type: 'COUPON_ISSUED',
            id: coupon.id.toString(),
            couponPolicyId: coupon.couponPolicyId.toString(),
            userId: coupon.userId.toString(),
            status: coupon.status,
            expirationTime: coupon.expirationTime,
            issuedAt: coupon.issuedAt,
        };
    }
}
