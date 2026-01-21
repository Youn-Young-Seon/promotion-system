import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '@app/common';
import { OrderStrategy } from './order-strategy.interface';
import { CreateOrderResponse } from '../dto';

/**
 * V2 Strategy: Redis-based order processing with atomic operations
 *
 * Performance: ~500 TPS
 * Features:
 * - Redis atomic operations (DECRBY)
 * - Cache-aside pattern
 * - Async DB synchronization
 * - Immediate response
 *
 * Best for: Moderate traffic, need immediate confirmation
 */
@Injectable()
export class OrderV2Strategy implements OrderStrategy {
    private readonly logger = new Logger(OrderV2Strategy.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {}

    async execute(timeSaleId: bigint, userId: bigint, quantity: bigint): Promise<CreateOrderResponse> {
        this.logger.log(`V2 Strategy - Processing order: timeSaleId=${timeSaleId}, userId=${userId}, quantity=${quantity}`);

        const redisKey = `timesale:stock:${timeSaleId}`;

        // Check if stock exists in Redis
        const stock = await this.redis.get(redisKey);

        if (!stock) {
            // Cache miss - load from DB
            const timeSale = await this.prisma.timeSale.findUnique({
                where: { id: timeSaleId },
            });

            if (!timeSale) {
                throw new NotFoundException('타임세일을 찾을 수 없습니다');
            }

            const now = new Date();
            if (timeSale.status !== 'ACTIVE') {
                throw new BadRequestException('타임세일이 진행 중이 아닙니다');
            }

            if (now < timeSale.startAt || now > timeSale.endAt) {
                throw new BadRequestException('타임세일 판매 시간이 아닙니다');
            }

            // Initialize Redis cache
            await this.redis.set(redisKey, timeSale.remainingQuantity.toString());
        }

        // Atomic decrement
        const remaining = await this.redis.decrBy(redisKey, Number(quantity));

        if (remaining < 0) {
            // Rollback if stock is insufficient
            await this.redis.getClient().incrBy(redisKey, Number(quantity));
            throw new BadRequestException('재고가 부족합니다');
        }

        // Create order in DB
        const order = await this.prisma.timeSaleOrder.create({
            data: {
                userId,
                timeSaleId,
                quantity,
                status: 'CONFIRMED',
            },
        });

        // Async DB synchronization (fire and forget)
        this.updateDbStock(timeSaleId, quantity).catch((err) => {
            this.logger.error('DB 재고 업데이트 실패:', err);
        });

        this.logger.log(`V2 Strategy - Order created: orderId=${order.id}`);

        return {
            type: 'ORDER_CREATED',
            id: order.id.toString(),
            userId: order.userId.toString(),
            timeSaleId: order.timeSaleId.toString(),
            quantity: order.quantity.toString(),
            status: order.status,
            createdAt: order.createdAt,
        };
    }

    /**
     * Asynchronously updates DB stock to keep it in sync with Redis
     */
    private async updateDbStock(timeSaleId: bigint, quantity: bigint): Promise<void> {
        await this.prisma.timeSale.update({
            where: { id: timeSaleId },
            data: {
                remainingQuantity: {
                    decrement: quantity,
                },
            },
        });
    }
}
