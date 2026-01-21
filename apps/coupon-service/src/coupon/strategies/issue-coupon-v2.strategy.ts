import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '@app/common';
import { IssueCouponStrategy } from './issue-coupon-strategy.interface';
import { IssueCouponResponse } from '../dto';

/**
 * V2 Strategy: Redis distributed lock-based coupon issuance
 *
 * Performance: ~500 TPS
 * Features:
 * - Redis distributed locks
 * - Cache-aside pattern for issued count
 * - Retry mechanism
 *
 * Best for: Moderate traffic, need immediate confirmation
 */
@Injectable()
export class IssueCouponV2Strategy implements IssueCouponStrategy {
    private readonly logger = new Logger(IssueCouponV2Strategy.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {}

    async execute(policyId: bigint, userId: bigint): Promise<IssueCouponResponse> {
        this.logger.log(`V2 Strategy - Issuing coupon: policyId=${policyId}, userId=${userId}`);

        const lockKey = `coupon:policy:${policyId}`;
        const maxRetries = 3;
        let retries = 0;

        while (retries < maxRetries) {
            const lockAcquired = await this.redis.acquireLock(lockKey, 5000);

            if (!lockAcquired) {
                retries++;
                await new Promise((resolve) => setTimeout(resolve, 100));
                continue;
            }

            try {
                const policy = await this.prisma.couponPolicy.findUnique({
                    where: { id: policyId },
                });

                if (!policy) {
                    throw new NotFoundException('쿠폰 정책을 찾을 수 없습니다');
                }

                const now = new Date();
                if (now < policy.startTime || now > policy.endTime) {
                    throw new BadRequestException('쿠폰 발급 가능 시간이 아닙니다');
                }

                const redisKey = `coupon:issued:${policyId}`;
                const issuedCount = await this.redis.get(redisKey);

                let currentCount = 0;
                if (issuedCount) {
                    currentCount = parseInt(issuedCount);
                } else {
                    const dbCount = await this.prisma.coupon.count({
                        where: { couponPolicyId: policyId },
                    });
                    currentCount = dbCount;
                    await this.redis.set(redisKey, dbCount.toString());
                }

                if (currentCount >= policy.totalQuantity) {
                    throw new BadRequestException('쿠폰이 모두 소진되었습니다');
                }

                const existingCoupon = await this.prisma.coupon.findFirst({
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

                const coupon = await this.prisma.coupon.create({
                    data: {
                        couponPolicyId: policyId,
                        userId: userId,
                        status: 'AVAILABLE',
                        expirationTime,
                    },
                });

                await this.redis.incr(redisKey);

                this.logger.log(`V2 Strategy - Coupon issued: couponId=${coupon.id}`);

                return {
                    type: 'COUPON_ISSUED',
                    id: coupon.id.toString(),
                    couponPolicyId: coupon.couponPolicyId.toString(),
                    userId: coupon.userId.toString(),
                    status: coupon.status,
                    expirationTime: coupon.expirationTime,
                    issuedAt: coupon.issuedAt,
                };
            } finally {
                await this.redis.releaseLock(lockKey);
            }
        }

        throw new BadRequestException('쿠폰 발급에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
}
