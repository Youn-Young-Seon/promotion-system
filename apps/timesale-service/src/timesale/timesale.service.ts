import { Injectable, OnModuleInit, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService, KafkaService } from '@app/common';
import { CreateTimeSaleDto, CreateOrderDto } from './dto';

@Injectable()
export class TimeSaleService implements OnModuleInit {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly kafka: KafkaService,
    ) { }

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

    async createOrder(timeSaleId: bigint, dto: CreateOrderDto, strategy: string = 'v1') {
        const userId = BigInt(dto.userId);
        const quantity = BigInt(dto.quantity);

        switch (strategy) {
            case 'v3':
                return this.createOrderV3(timeSaleId, userId, quantity);
            case 'v2':
                return this.createOrderV2(timeSaleId, userId, quantity);
            case 'v1':
            default:
                return this.createOrderV1(timeSaleId, userId, quantity);
        }
    }

    // V1: DB 기반 주문 처리 (트랜잭션)
    private async createOrderV1(timeSaleId: bigint, userId: bigint, quantity: bigint) {
        return this.prisma.$transaction(async (tx) => {
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

            return {
                id: order.id.toString(),
                userId: order.userId.toString(),
                timeSaleId: order.timeSaleId.toString(),
                quantity: order.quantity.toString(),
                status: order.status,
                createdAt: order.createdAt,
            };
        });
    }

    // V2: Redis 기반 재고 관리
    private async createOrderV2(timeSaleId: bigint, userId: bigint, quantity: bigint) {
        const redisKey = `timesale:stock:${timeSaleId}`;

        const stock = await this.redis.get(redisKey);

        if (!stock) {
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

            await this.redis.set(redisKey, timeSale.remainingQuantity.toString());
        }

        const remaining = await this.redis.decrBy(redisKey, Number(quantity));

        if (remaining < 0) {
            await this.redis.getClient().incrBy(redisKey, Number(quantity));
            throw new BadRequestException('재고가 부족합니다');
        }

        const order = await this.prisma.timeSaleOrder.create({
            data: {
                userId,
                timeSaleId,
                quantity,
                status: 'CONFIRMED',
            },
        });

        this.updateDbStock(timeSaleId, quantity).catch((err) => {
            console.error('DB 재고 업데이트 실패:', err);
        });

        return {
            id: order.id.toString(),
            userId: order.userId.toString(),
            timeSaleId: order.timeSaleId.toString(),
            quantity: order.quantity.toString(),
            status: order.status,
            createdAt: order.createdAt,
        };
    }

    // V3: Kafka 대기열 기반 주문 처리
    private async createOrderV3(timeSaleId: bigint, userId: bigint, quantity: bigint) {
        // 1. 기본 검증
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

        // 2. Kafka로 주문 요청 전송
        await this.kafka.sendMessage('timesale-order-requests', {
            timeSaleId: timeSaleId.toString(),
            userId: userId.toString(),
            quantity: quantity.toString(),
            requestedAt: new Date().toISOString(),
        });

        // 3. 즉시 응답 (대기열 등록)
        return {
            status: 'QUEUED',
            message: '주문 요청이 대기열에 등록되었습니다. 순차적으로 처리됩니다.',
            timeSaleId: timeSaleId.toString(),
            userId: userId.toString(),
            queuePosition: 'Processing...',
        };
    }

    // Kafka Consumer에서 호출되는 실제 주문 처리
    private async processOrder(message: any) {
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
                console.error(`Order failed: insufficient stock for timeSaleId=${timeSaleId}`);

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
                console.error('DB 재고 업데이트 실패:', err);
            });

            console.log(`Order processed successfully: orderId=${order.id}, timeSaleId=${timeSaleId}`);
        } catch (error) {
            console.error('Error processing order:', error);
        }
    }

    private async updateDbStock(timeSaleId: bigint, quantity: bigint) {
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
