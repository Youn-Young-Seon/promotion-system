import { Injectable, OnModuleInit, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService, KafkaService } from '@app/common';
import { CreateCouponPolicyDto, IssueCouponDto, IssueCouponResponse } from './dto';
import { IssueCouponStrategy, StrategyType, IssueCouponV1Strategy, IssueCouponV2Strategy, IssueCouponV3Strategy } from './strategies';

/**
 * Coupon Service
 *
 * Uses Strategy Pattern for coupon issuance:
 * - V1: Database transactions (strong consistency)
 * - V2: Redis distributed locks (high performance)
 * - V3: Kafka async processing (ultra high throughput)
 */
@Injectable()
export class CouponService implements OnModuleInit {
    private readonly logger = new Logger(CouponService.name);
    private readonly strategies: Map<StrategyType, IssueCouponStrategy>;

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly kafka: KafkaService,
        private readonly issueCouponV1Strategy: IssueCouponV1Strategy,
        private readonly issueCouponV2Strategy: IssueCouponV2Strategy,
        private readonly issueCouponV3Strategy: IssueCouponV3Strategy,
    ) {
        // Initialize strategy map
        this.strategies = new Map<StrategyType, IssueCouponStrategy>([
            ['v1', this.issueCouponV1Strategy],
            ['v2', this.issueCouponV2Strategy],
            ['v3', this.issueCouponV3Strategy],
        ]);
    }

    async onModuleInit() {
        // Kafka Consumer 시작 - 쿠폰 발급 요청 처리
        await this.kafka.subscribe(
            'coupon-issue-requests',
            'coupon-service-group',
            async (payload) => {
                const message = JSON.parse(payload.message.value.toString());
                await this.processCouponIssue(message);
            },
        );
    }

    async createPolicy(dto: CreateCouponPolicyDto) {
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);

        if (startTime >= endTime) {
            throw new BadRequestException('시작 시간은 종료 시간보다 이전이어야 합니다');
        }

        const policy = await this.prisma.couponPolicy.create({
            data: {
                title: dto.title,
                description: dto.description,
                totalQuantity: dto.totalQuantity,
                startTime,
                endTime,
                discountType: dto.discountType,
                discountValue: dto.discountValue,
                minimumOrderAmount: dto.minimumOrderAmount,
                maximumDiscountAmount: dto.maximumDiscountAmount,
            },
        });

        return {
            id: policy.id.toString(),
            title: policy.title,
            totalQuantity: policy.totalQuantity,
            createdAt: policy.createdAt,
        };
    }

    /**
     * Issues a coupon using the specified strategy
     *
     * Strategy Pattern: Delegates coupon issuance to the appropriate strategy
     *
     * @param dto - Coupon issuance data
     * @param strategyType - Strategy to use (v1, v2, v3)
     * @returns Coupon response (issued or pending)
     */
    async issueCoupon(dto: IssueCouponDto, strategyType: string = 'v1'): Promise<IssueCouponResponse> {
        const policyId = BigInt(dto.policyId);
        const userId = BigInt(dto.userId);

        // Get strategy from map (defaults to v1 if invalid)
        const strategy = this.strategies.get(strategyType as StrategyType) || this.strategies.get('v1')!;

        this.logger.log(`Issuing coupon with strategy: ${strategyType}`);

        // Delegate to strategy
        return strategy.execute(policyId, userId);
    }

    /**
     * Kafka Consumer handler for V3 async coupon issuance
     *
     * @param message - Kafka message containing issuance data
     */
    private async processCouponIssue(message: any): Promise<void> {
        const policyId = BigInt(message.policyId);
        const userId = BigInt(message.userId);

        try {
            // Redis 분산 락 사용
            const lockKey = `coupon:policy:${policyId}`;
            const lockAcquired = await this.redis.acquireLock(lockKey, 5000);

            if (!lockAcquired) {
                this.logger.error('Failed to acquire lock for coupon issue');
                return;
            }

            try {
                const policy = await this.prisma.couponPolicy.findUnique({
                    where: { id: policyId },
                });

                if (!policy) {
                    this.logger.error('Coupon policy not found');
                    return;
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
                    this.logger.warn('Coupon sold out');
                    return;
                }

                const expirationTime = new Date(policy.endTime);
                expirationTime.setDate(expirationTime.getDate() + 30);

                await this.prisma.coupon.create({
                    data: {
                        couponPolicyId: policyId,
                        userId: userId,
                        status: 'AVAILABLE',
                        expirationTime,
                    },
                });

                await this.redis.incr(redisKey);

                this.logger.log(`Coupon issued successfully: policyId=${policyId}, userId=${userId}`);
            } finally {
                await this.redis.releaseLock(lockKey);
            }
        } catch (error) {
            this.logger.error('Error processing coupon issue:', error.stack || error);
        }
    }

    async useCoupon(couponId: bigint, orderId: bigint) {
        return this.prisma.$transaction(async (tx) => {
            const coupon = await tx.coupon.findUnique({
                where: { id: couponId },
                include: { couponPolicy: true },
            });

            if (!coupon) {
                throw new NotFoundException('쿠폰을 찾을 수 없습니다');
            }

            if (coupon.status !== 'AVAILABLE') {
                throw new BadRequestException('사용 가능한 쿠폰이 아닙니다');
            }

            const now = new Date();
            if (now > coupon.expirationTime) {
                throw new BadRequestException('만료된 쿠폰입니다');
            }

            const updatedCoupon = await tx.coupon.update({
                where: { id: couponId },
                data: {
                    status: 'USED',
                    orderId: orderId,
                },
            });

            return {
                id: updatedCoupon.id.toString(),
                status: updatedCoupon.status,
                orderId: updatedCoupon.orderId?.toString(),
                discountType: coupon.couponPolicy.discountType,
                discountValue: coupon.couponPolicy.discountValue,
                minimumOrderAmount: coupon.couponPolicy.minimumOrderAmount,
                maximumDiscountAmount: coupon.couponPolicy.maximumDiscountAmount,
            };
        });
    }

    async getUserCoupons(userId: bigint) {
        const coupons = await this.prisma.coupon.findMany({
            where: { userId },
            include: {
                couponPolicy: {
                    select: {
                        title: true,
                        discountType: true,
                        discountValue: true,
                    },
                },
            },
            orderBy: { issuedAt: 'desc' },
        });

        return {
            coupons: coupons.map((c) => ({
                id: c.id.toString(),
                couponPolicy: {
                    title: c.couponPolicy.title,
                    discountType: c.couponPolicy.discountType,
                    discountValue: c.couponPolicy.discountValue,
                },
                status: c.status,
                expirationTime: c.expirationTime,
            })),
            total: coupons.length,
        };
    }
}
