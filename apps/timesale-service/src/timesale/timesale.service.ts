import { Injectable, OnModuleInit, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService, KafkaService } from '@app/common';
import { CreateTimeSaleDto, CreateOrderDto, CreateOrderResponse } from './dto';
import { OrderStrategy, StrategyType, OrderV1Strategy, OrderV2Strategy, OrderV3Strategy } from './strategies';

/**
 * TimeSale Service
 *
 * Uses Strategy Pattern for order processing:
 * - V1: Database transactions (strong consistency)
 * - V2: Redis atomic operations (high performance)
 * - V3: Kafka async processing (ultra high throughput)
 */
@Injectable()
export class TimeSaleService implements OnModuleInit {
    private readonly logger = new Logger(TimeSaleService.name);
    private readonly strategies: Map<StrategyType, OrderStrategy>;

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly kafka: KafkaService,
        private readonly orderV1Strategy: OrderV1Strategy,
        private readonly orderV2Strategy: OrderV2Strategy,
        private readonly orderV3Strategy: OrderV3Strategy,
    ) {
        // Initialize strategy map
        this.strategies = new Map<StrategyType, OrderStrategy>([
            ['v1', this.orderV1Strategy],
            ['v2', this.orderV2Strategy],
            ['v3', this.orderV3Strategy],
        ]);
    }

    async onModuleInit() {
        // Kafka Consumer 시작 - 타임세일 주문 요청 처리
        await this.kafka.subscribe(
            'timesale-order-requests',
            'timesale-service-group',
            async (payload) => {
                const message = JSON.parse(payload.message.value.toString());
                await this.processOrder(message);
            },
        );
    }

    async createTimeSale(dto: CreateTimeSaleDto) {
        const productId = BigInt(dto.productId);
        const startAt = new Date(dto.startAt);
        const endAt = new Date(dto.endAt);

        if (startAt >= endAt) {
            throw new BadRequestException('시작 시간은 종료 시간보다 이전이어야 합니다');
        }

        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('상품을 찾을 수 없습니다');
        }

        const timeSale = await this.prisma.timeSale.create({
            data: {
                productId,
                quantity: BigInt(dto.quantity),
                remainingQuantity: BigInt(dto.quantity),
                discountPrice: BigInt(dto.discountPrice),
                startAt,
                endAt,
                status: 'SCHEDULED',
            },
        });

        return {
            id: timeSale.id.toString(),
            productId: timeSale.productId.toString(),
            quantity: timeSale.quantity.toString(),
            remainingQuantity: timeSale.remainingQuantity.toString(),
            discountPrice: timeSale.discountPrice.toString(),
            status: timeSale.status,
            createdAt: timeSale.createdAt,
        };
    }

    /**
     * Creates an order using the specified strategy
     *
     * Strategy Pattern: Delegates order processing to the appropriate strategy
     *
     * @param timeSaleId - The timesale ID
     * @param dto - Order data
     * @param strategyType - Strategy to use (v1, v2, v3)
     * @returns Order response (created or queued)
     */
    async createOrder(
        timeSaleId: bigint,
        dto: CreateOrderDto,
        strategyType: string = 'v1',
    ): Promise<CreateOrderResponse> {
        const userId = BigInt(dto.userId);
        const quantity = BigInt(dto.quantity);

        // Get strategy from map (defaults to v1 if invalid)
        const strategy = this.strategies.get(strategyType as StrategyType) || this.strategies.get('v1')!;

        this.logger.log(`Creating order with strategy: ${strategyType}`);

        // Delegate to strategy
        return strategy.execute(timeSaleId, userId, quantity);
    }

    /**
     * Kafka Consumer handler for V3 async order processing
     *
     * @param message - Kafka message containing order data
     */
    private async processOrder(message: any): Promise<void> {
        const timeSaleId = BigInt(message.timeSaleId);
        const userId = BigInt(message.userId);
        const quantity = BigInt(message.quantity);

        try {
            // Redis 재고 차감
            const redisKey = `timesale:stock:${timeSaleId}`;
            const remaining = await this.redis.decrBy(redisKey, Number(quantity));

            if (remaining < 0) {
                // 재고 부족 - 롤백
                await this.redis.getClient().incrBy(redisKey, Number(quantity));
                this.logger.warn(`Order failed: insufficient stock for timeSaleId=${timeSaleId}`);

                // 실패 알림 (실제로는 별도 토픽으로 전송)
                await this.kafka.sendMessage('timesale-order-failures', {
                    timeSaleId: timeSaleId.toString(),
                    userId: userId.toString(),
                    reason: 'INSUFFICIENT_STOCK',
                });
                return;
            }

            // 주문 생성
            const order = await this.prisma.timeSaleOrder.create({
                data: {
                    userId,
                    timeSaleId,
                    quantity,
                    status: 'CONFIRMED',
                },
            });

            // 성공 알림 (실제로는 별도 토픽으로 전송)
            await this.kafka.sendMessage('timesale-order-success', {
                orderId: order.id.toString(),
                timeSaleId: timeSaleId.toString(),
                userId: userId.toString(),
                quantity: quantity.toString(),
            });

            // 비동기 DB 재고 업데이트
            this.updateDbStock(timeSaleId, quantity).catch((err) => {
                this.logger.error('DB 재고 업데이트 실패:', err);
            });

            this.logger.log(`Order processed successfully: orderId=${order.id}, timeSaleId=${timeSaleId}`);
        } catch (error) {
            this.logger.error('Error processing order:', error.stack || error);
        }
    }

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

    async getTimeSale(id: bigint) {
        const timeSale = await this.prisma.timeSale.findUnique({
            where: { id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                    },
                },
            },
        });

        if (!timeSale) {
            throw new NotFoundException('타임세일을 찾을 수 없습니다');
        }

        return {
            id: timeSale.id.toString(),
            product: {
                id: timeSale.product.id.toString(),
                name: timeSale.product.name,
                price: timeSale.product.price.toString(),
            },
            quantity: timeSale.quantity.toString(),
            remainingQuantity: timeSale.remainingQuantity.toString(),
            discountPrice: timeSale.discountPrice.toString(),
            status: timeSale.status,
            startAt: timeSale.startAt,
            endAt: timeSale.endAt,
        };
    }
}
