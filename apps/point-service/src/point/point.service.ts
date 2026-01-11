import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '@app/common';
import { AddPointDto, UsePointDto } from './dto';

@Injectable()
export class PointService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) { }

    async getBalance(userId: bigint) {
        // Redis 캐시 확인
        const cacheKey = `point:balance:${userId}`;
        const cached = await this.redis.get(cacheKey);

        if (cached) {
            return JSON.parse(cached);
        }

        // 캐시 미스 - DB에서 조회
        let balance = await this.prisma.pointBalance.findUnique({
            where: { userId },
        });

        if (!balance) {
            balance = await this.prisma.pointBalance.create({
                data: {
                    userId,
                    balance: BigInt(0),
                },
            });
        }

        const result = {
            userId: balance.userId.toString(),
            balance: balance.balance.toString(),
            updatedAt: balance.updatedAt,
        };

        // Redis에 캐싱 (TTL: 60초)
        await this.redis.set(cacheKey, JSON.stringify(result), 60);

        return result;
    }

    async getHistory(userId: bigint, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [points, total] = await Promise.all([
            this.prisma.point.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.point.count({
                where: { userId },
            }),
        ]);

        return {
            points: points.map((p) => ({
                id: p.id.toString(),
                amount: p.type === 'EARNED' ? p.amount.toString() : `-${p.amount.toString()}`,
                type: p.type,
                description: p.description,
                balanceSnapshot: p.balanceSnapshot.toString(),
                createdAt: p.createdAt,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async addPoint(dto: AddPointDto) {
        const userId = BigInt(dto.userId);
        const amount = BigInt(dto.amount);

        const result = await this.prisma.$transaction(async (tx) => {
            const balance = await tx.pointBalance.findUnique({
                where: { userId },
            });

            if (!balance) {
                const newBalance = await tx.pointBalance.create({
                    data: {
                        userId,
                        balance: amount,
                        version: BigInt(1),
                    },
                });

                const point = await tx.point.create({
                    data: {
                        userId,
                        amount,
                        type: 'EARNED',
                        description: dto.description,
                        balanceSnapshot: newBalance.balance,
                    },
                });

                return {
                    id: point.id.toString(),
                    userId: point.userId.toString(),
                    amount: point.amount.toString(),
                    type: point.type,
                    balanceSnapshot: point.balanceSnapshot.toString(),
                    createdAt: point.createdAt,
                };
            }

            const updatedBalance = await tx.pointBalance.updateMany({
                where: {
                    userId,
                    version: balance.version,
                },
                data: {
                    balance: balance.balance + amount,
                    version: balance.version + BigInt(1),
                },
            });

            if (updatedBalance.count === 0) {
                throw new BadRequestException('동시성 충돌이 발생했습니다. 다시 시도해주세요.');
            }

            const newBalance = await tx.pointBalance.findUnique({
                where: { userId },
            });

            const point = await tx.point.create({
                data: {
                    userId,
                    amount,
                    type: 'EARNED',
                    description: dto.description,
                    balanceSnapshot: newBalance!.balance,
                },
            });

            return {
                id: point.id.toString(),
                userId: point.userId.toString(),
                amount: point.amount.toString(),
                type: point.type,
                balanceSnapshot: point.balanceSnapshot.toString(),
                createdAt: point.createdAt,
            };
        });

        // 캐시 무효화
        await this.redis.del(`point:balance:${userId}`);

        return result;
    }

    async usePoint(dto: UsePointDto) {
        const userId = BigInt(dto.userId);
        const amount = BigInt(dto.amount);

        const result = await this.prisma.$transaction(async (tx) => {
            const balance = await tx.pointBalance.findUnique({
                where: { userId },
            });

            if (!balance) {
                throw new NotFoundException('적립금 정보를 찾을 수 없습니다');
            }

            if (balance.balance < amount) {
                throw new BadRequestException('적립금 잔액이 부족합니다');
            }

            const updatedBalance = await tx.pointBalance.updateMany({
                where: {
                    userId,
                    version: balance.version,
                },
                data: {
                    balance: balance.balance - amount,
                    version: balance.version + BigInt(1),
                },
            });

            if (updatedBalance.count === 0) {
                throw new BadRequestException('동시성 충돌이 발생했습니다. 다시 시도해주세요.');
            }

            const newBalance = await tx.pointBalance.findUnique({
                where: { userId },
            });

            const point = await tx.point.create({
                data: {
                    userId,
                    amount,
                    type: 'SPENT',
                    description: dto.description,
                    balanceSnapshot: newBalance!.balance,
                },
            });

            return {
                id: point.id.toString(),
                userId: point.userId.toString(),
                amount: `-${point.amount.toString()}`,
                type: point.type,
                balanceSnapshot: point.balanceSnapshot.toString(),
                createdAt: point.createdAt,
            };
        });

        // 캐시 무효화
        await this.redis.del(`point:balance:${userId}`);

        return result;
    }
}
