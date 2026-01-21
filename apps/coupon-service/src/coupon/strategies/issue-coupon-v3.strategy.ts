import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { KafkaService } from '@app/common';
import { IssueCouponStrategy } from './issue-coupon-strategy.interface';
import { IssueCouponResponse } from '../dto';

/**
 * V3 Strategy: Kafka-based asynchronous coupon issuance
 *
 * Performance: ~5,000+ TPS
 * Features:
 * - Immediate response (PENDING status)
 * - Async processing via Kafka
 * - Sequential processing via Kafka topics
 * - High throughput for flash sales
 *
 * Best for: High traffic events (flash sales, promotions)
 */
@Injectable()
export class IssueCouponV3Strategy implements IssueCouponStrategy {
    private readonly logger = new Logger(IssueCouponV3Strategy.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly kafka: KafkaService,
    ) {}

    async execute(policyId: bigint, userId: bigint): Promise<IssueCouponResponse> {
        this.logger.log(`V3 Strategy - Queuing coupon issue: policyId=${policyId}, userId=${userId}`);

        // 1. Basic validation (fail fast)
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

        // 2. Check for duplicate issuance
        const existingCoupon = await this.prisma.coupon.findFirst({
            where: {
                couponPolicyId: policyId,
                userId: userId,
            },
        });

        if (existingCoupon) {
            throw new BadRequestException('이미 발급받은 쿠폰입니다');
        }

        // 3. Send issuance request to Kafka
        await this.kafka.sendMessage('coupon-issue-requests', {
            policyId: policyId.toString(),
            userId: userId.toString(),
            requestedAt: new Date().toISOString(),
        });

        this.logger.log(`V3 Strategy - Coupon issue queued: policyId=${policyId}, userId=${userId}`);

        // 4. Immediate response (async processing)
        return {
            type: 'COUPON_PENDING',
            status: 'PENDING',
            message: '쿠폰 발급 요청이 접수되었습니다. 잠시 후 확인해주세요.',
            policyId: policyId.toString(),
            userId: userId.toString(),
        };
    }
}
