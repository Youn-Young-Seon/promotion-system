import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RedisService, KafkaService } from '@common/index';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeSaleDto } from './dto';
import { TimeSale, TimeSaleStatus } from '../../prisma/generated/client';

@Injectable()
export class TimeSaleService {
  private readonly logger = new Logger(TimeSaleService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly kafka: KafkaService,
  ) {}

  async create(dto: CreateTimeSaleDto): Promise<TimeSale> {
    this.logger.log(`Creating time sale for product ${dto.productId}`);

    // 상품 존재 확인
    const product = await this.prisma.product.findUnique({
      where: { id: BigInt(dto.productId) },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    // 시작 시간에 따라 상태 결정
    const now = new Date();
    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);

    let status: TimeSaleStatus;
    if (now < startAt) {
      status = TimeSaleStatus.SCHEDULED;
    } else if (now >= startAt && now <= endAt) {
      status = TimeSaleStatus.ACTIVE;
    } else {
      status = TimeSaleStatus.ENDED;
    }

    const timeSale = await this.prisma.timeSale.create({
      data: {
        productId: BigInt(dto.productId),
        quantity: dto.quantity,
        remainingQuantity: dto.quantity,
        discountPrice: dto.discountPrice,
        startAt,
        endAt,
        status,
      },
      include: {
        product: true,
      },
    });

    // Redis에 재고 동기화 (ACTIVE 상태일 경우)
    if (status === TimeSaleStatus.ACTIVE) {
      const inventoryKey = `timesale:inventory:${timeSale.id}`;
      await this.redis.set(inventoryKey, String(dto.quantity));
      this.logger.log(`Inventory synced to Redis for time sale ${timeSale.id}`);
    }

    // Kafka 이벤트 발행
    await this.kafka.emit('timesale.created', {
      id: Number(timeSale.id),
      productId: dto.productId,
      quantity: dto.quantity,
      status,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    });

    this.logger.log(`Time sale created: ${timeSale.id}`);
    return timeSale;
  }

  async findById(id: number): Promise<TimeSale> {
    const timeSale = await this.prisma.timeSale.findUnique({
      where: { id: BigInt(id) },
      include: {
        product: true,
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!timeSale) {
      throw new NotFoundException(`Time sale with ID ${id} not found`);
    }

    return timeSale;
  }

  async findAll(
    page = 0,
    size = 10,
    status?: TimeSaleStatus,
  ): Promise<{ timeSales: TimeSale[]; total: number }> {
    const where = status ? { status } : {};

    const [timeSales, total] = await Promise.all([
      this.prisma.timeSale.findMany({
        where,
        skip: page * size,
        take: size,
        include: {
          product: true,
        },
        orderBy: { startAt: 'desc' },
      }),
      this.prisma.timeSale.count({ where }),
    ]);

    return { timeSales, total };
  }
}
