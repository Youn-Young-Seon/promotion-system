import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStrategy } from './order-strategy.interface';
import { CreateOrderResponse } from '../dto';

/**
 * V1 Strategy: Database-based order processing with transactions
 *
 * Performance: ~100 TPS
 * Features:
 * - Pessimistic locking via database transactions
 * - Optimistic locking with version field
 * - Strong consistency guarantee
 *
 * Best for: Development, testing, audit requirements
 */
@Injectable()
export class OrderV1Strategy implements OrderStrategy {
    private readonly logger = new Logger(OrderV1Strategy.name);

    constructor(private readonly prisma: PrismaService) {}

    async execute(timeSaleId: bigint, userId: bigint, quantity: bigint): Promise<CreateOrderResponse> {
        this.logger.log(`V1 Strategy - Processing order: timeSaleId=${timeSaleId}, userId=${userId}, quantity=${quantity}`);

        const order = await this.prisma.$transaction(async (tx) => {
            const timeSale = await tx.timeSale.findUnique({
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

            if (timeSale.remainingQuantity < quantity) {
                throw new BadRequestException('재고가 부족합니다');
            }

            // Optimistic locking
            const updatedTimeSale = await tx.timeSale.updateMany({
                where: {
                    id: timeSaleId,
                    version: timeSale.version,
                },
                data: {
                    remainingQuantity: timeSale.remainingQuantity - quantity,
                    version: timeSale.version + BigInt(1),
                },
            });

            if (updatedTimeSale.count === 0) {
                throw new BadRequestException('동시성 충돌이 발생했습니다. 다시 시도해주세요.');
            }

            const order = await tx.timeSaleOrder.create({
                data: {
                    userId,
                    timeSaleId,
                    quantity,
                    status: 'CONFIRMED',
                },
            });

            return order;
        });

        this.logger.log(`V1 Strategy - Order created: orderId=${order.id}`);

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
}
