import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RedisService, KafkaService } from '@common/index';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';
import { TimeSaleOrder, OrderStatus, TimeSaleStatus } from '../../prisma/generated/client';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly kafka: KafkaService,
  ) {}

  async create(dto: CreateOrderDto): Promise<TimeSaleOrder> {
    this.logger.log(
      `Creating order for time sale ${dto.timeSaleId}, user ${dto.userId}`,
    );

    const inventoryKey = `timesale:inventory:${dto.timeSaleId}`;
    const lockKey = `timesale:lock:${dto.timeSaleId}`;

    // 분산 락을 사용하여 동시성 제어
    return await this.redis.executeWithLock(
      lockKey,
      async () => {
        // Redis에서 재고 확인
        const redisInventory = await this.redis.get(inventoryKey);

        if (redisInventory !== null) {
          // Redis 재고가 있으면 Redis 기반으로 처리
          const currentInventory = parseInt(redisInventory, 10);

          if (currentInventory < dto.quantity) {
            throw new BadRequestException(
              `Insufficient stock. Available: ${currentInventory}, Requested: ${dto.quantity}`,
            );
          }

          // Redis 재고 감소
          const newInventory = currentInventory - dto.quantity;
          await this.redis.set(inventoryKey, String(newInventory));

          // DB에 주문 생성 (비동기)
          const order = await this.createOrderInDb(dto);

          // 주문 생성 후 DB 재고 동기화 (백그라운드)
          void this.syncInventoryToDb(dto.timeSaleId, newInventory);

          return order;
        } else {
          // Redis 재고가 없으면 DB에서 직접 처리 (fallback)
          return await this.createOrderInDb(dto);
        }
      },
      5000, // 5초 락 타임아웃
    );
  }

  private async createOrderInDb(dto: CreateOrderDto): Promise<TimeSaleOrder> {
    return await this.prisma.$transaction(async (tx) => {
      // 타임세일 조회
      const timeSale = await tx.timeSale.findUnique({
        where: { id: BigInt(dto.timeSaleId) },
      });

      if (!timeSale) {
        throw new NotFoundException(`Time sale with ID ${dto.timeSaleId} not found`);
      }

      // 타임세일 상태 체크
      if (timeSale.status !== TimeSaleStatus.ACTIVE) {
        throw new BadRequestException('Time sale is not active');
      }

      // 재고 체크
      if (timeSale.remainingQuantity < dto.quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${timeSale.remainingQuantity}, Requested: ${dto.quantity}`,
        );
      }

      // 재고 감소
      await tx.timeSale.update({
        where: { id: BigInt(dto.timeSaleId) },
        data: {
          remainingQuantity: { decrement: dto.quantity },
        },
      });

      // 주문 생성
      const order = await tx.timeSaleOrder.create({
        data: {
          timeSaleId: BigInt(dto.timeSaleId),
          userId: BigInt(dto.userId),
          quantity: dto.quantity,
          status: OrderStatus.COMPLETED,
          queueNumber: 0,
        },
        include: {
          timeSale: {
            include: {
              product: true,
            },
          },
        },
      });

      // 재고가 0이 되면 상태 업데이트
      if (timeSale.remainingQuantity - dto.quantity === 0) {
        await tx.timeSale.update({
          where: { id: BigInt(dto.timeSaleId) },
          data: { status: TimeSaleStatus.SOLD_OUT },
        });
      }

      // Kafka 이벤트 발행
      await this.kafka.emit('order.created', {
        id: Number(order.id),
        timeSaleId: dto.timeSaleId,
        userId: dto.userId,
        quantity: dto.quantity,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      });

      this.logger.log(`Order created successfully: ${order.id}`);
      return order;
    });
  }

  private async syncInventoryToDb(timeSaleId: number, newInventory: number): Promise<void> {
    try {
      await this.prisma.timeSale.update({
        where: { id: BigInt(timeSaleId) },
        data: { remainingQuantity: newInventory },
      });
      this.logger.log(`Inventory synced to DB for time sale ${timeSaleId}`);
    } catch (error: unknown) {
      this.logger.error(`Failed to sync inventory to DB for time sale ${timeSaleId}`, error);
    }
  }

  async findById(id: number): Promise<TimeSaleOrder> {
    const order = await this.prisma.timeSaleOrder.findUnique({
      where: { id: BigInt(id) },
      include: {
        timeSale: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
}
