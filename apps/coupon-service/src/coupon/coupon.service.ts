import { Injectable, OnModuleInit, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService, KafkaService } from '@app/common';
import { CreateCouponPolicyDto, IssueCouponDto } from './dto';

@Injectable()
export class CouponService implements OnModuleInit {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly kafka: KafkaService,
    ) { }

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

    async issueCoupon(dto: IssueCouponDto, strategy: string = 'v1') {
        const policyId = BigInt(dto.policyId);
        const userId = BigInt(dto.userId);

        switch (strategy) {
            case 'v3':
                return this.issueCouponV3(policyId, userId);
            case 'v2':
                return this.issueCouponV2(policyId, userId);
            case 'v1':
            default:
                return this.issueCouponV1(policyId, userId);
        }
    }

    // V1: DB 기반 쿠폰 발급 (트랜잭션)
    private async issueCouponV1(policyId: bigint, userId: bigint) {
        return this.prisma.$transaction(async (tx) => {
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

            return {
                id: coupon.id.toString(),
                couponPolicyId: coupon.couponPolicyId.toString(),
                userId: coupon.userId.toString(),
                status: coupon.status,
                expirationTime: coupon.expirationTime,
                issuedAt: coupon.issuedAt,
            };
        });
    }

    // V2: Redis 분산 락 기반 쿠폰 발급
    private async issueCouponV2(policyId: bigint, userId: bigint) {
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

                return {
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

    // V3: Kafka 비동기 쿠폰 발급
    private async issueCouponV3(policyId: bigint, userId: bigint) {
        // 1. 기본 검증 (빠른 실패)
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

        // 2. 중복 발급 확인
        const existingCoupon = await this.prisma.coupon.findFirst({
            where: {
                couponPolicyId: policyId,
                userId: userId,
            },
        });

        if (existingCoupon) {
            throw new BadRequestException('이미 발급받은 쿠폰입니다');
        }

        // 3. Kafka로 발급 요청 전송
        await this.kafka.sendMessage('coupon-issue-requests', {
            policyId: policyId.toString(),
            userId: userId.toString(),
            requestedAt: new Date().toISOString(),
        });

        // 4. 즉시 응답 (비동기 처리)
        return {
            status: 'PENDING',
            message: '쿠폰 발급 요청이 접수되었습니다. 잠시 후 확인해주세요.',
            policyId: policyId.toString(),
            userId: userId.toString(),
        };
    }

    // Kafka Consumer에서 호출되는 실제 발급 처리
    private async processCouponIssue(message: any) {
        const policyId = BigInt(message.policyId);
        const userId = BigInt(message.userId);

        try {
            // Redis 분산 락 사용
            const lockKey = `coupon:policy:${policyId}`;
            const lockAcquired = await this.redis.acquireLock(lockKey, 5000);

            if (!lockAcquired) {
                console.error('Failed to acquire lock for coupon issue');
                return;
            }

            try {
                const policy = await this.prisma.couponPolicy.findUnique({
                    where: { id: policyId },
                });

                if (!policy) {
                    console.error('Coupon policy not found');
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
                    console.error('Coupon sold out');
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

                console.log(`Coupon issued successfully: policyId=${policyId}, userId=${userId}`);
            } finally {
                await this.redis.releaseLock(lockKey);
            }
        } catch (error) {
            console.error('Error processing coupon issue:', error);
        }
    }

    // 쿠폰 사용
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
