import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { KafkaService } from '@app/common';
import { OrderStrategy } from './order-strategy.interface';
import { CreateOrderResponse } from '../dto';

/**
 * V3 Strategy: Kafka-based asynchronous order processing
 *
 * Performance: ~5,000+ TPS
 * Features:
 * - Immediate response (PENDING/QUEUED status)
 * - Async processing via Kafka
 * - Sequential processing via Kafka topics
 * - High throughput for flash sales
 *
 * Best for: High traffic events (flash sales, promotions)
 */
@Injectable()
export class OrderV3Strategy implements OrderStrategy {
    private readonly logger = new Logger(OrderV3Strategy.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly kafka: KafkaService,
    ) {}

    async execute(timeSaleId: bigint, userId: bigint, quantity: bigint): Promise<CreateOrderResponse> {
        this.logger.log(`V3 Strategy - Queuing order: timeSaleId=${timeSaleId}, userId=${userId}, quantity=${quantity}`);

        // 1. Basic validation
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

        // 2. Send order request to Kafka
        await this.kafka.sendMessage('timesale-order-requests', {
            timeSaleId: timeSaleId.toString(),
            userId: userId.toString(),
            quantity: quantity.toString(),
            requestedAt: new Date().toISOString(),
        });

        this.logger.log(`V3 Strategy - Order queued: timeSaleId=${timeSaleId}, userId=${userId}`);

        // 3. Immediate response (queued status)
        return {
            type: 'ORDER_QUEUED',
            status: 'QUEUED',
            message: '주문 요청이 대기열에 등록되었습니다. 순차적으로 처리됩니다.',
            timeSaleId: timeSaleId.toString(),
            userId: userId.toString(),
            queuePosition: 'Processing...',
        };
    }
}
