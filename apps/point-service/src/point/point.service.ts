import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { RedisService, KafkaService } from '@common/index';
import { PrismaService } from '../prisma/prisma.service';
import { EarnPointsDto, UsePointsDto, CancelPointsDto } from './dto';
import { Point, PointType } from '../../prisma/generated/client';

@Injectable()
export class PointService {
  private readonly logger = new Logger(PointService.name);
  private readonly MAX_RETRIES = 3;
  private readonly CACHE_TTL = 300; // 5분

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly kafka: KafkaService,
  ) {}

  async earnPoints(dto: EarnPointsDto): Promise<Point> {
    this.logger.log(`Earning ${dto.amount} points for user ${dto.userId}`);

    return this.retryOnConflict(async () => {
      return await this.prisma.$transaction(async (tx) => {
        // 사용자 포인트 잔액 조회 또는 생성
        let balance = await tx.pointBalance.findUnique({
          where: { userId: BigInt(dto.userId) },
        });

        if (!balance) {
          balance = await tx.pointBalance.create({
            data: {
              userId: BigInt(dto.userId),
              balance: BigInt(0),
              version: 0,
            },
          });
        }

        const currentBalance = Number(balance.balance);
        const newBalance = currentBalance + dto.amount;

        // Optimistic Locking으로 잔액 업데이트
        const updated = await tx.pointBalance.updateMany({
          where: {
            userId: BigInt(dto.userId),
            version: balance.version,
          },
          data: {
            balance: BigInt(newBalance),
            version: { increment: 1 },
          },
        });

        if (updated.count === 0) {
          throw new ConflictException('Point balance was modified by another transaction');
        }

        // 포인트 트랜잭션 기록
        const point = await tx.point.create({
          data: {
            userId: BigInt(dto.userId),
            amount: BigInt(dto.amount),
            type: PointType.EARNED,
            description: dto.description,
            balanceSnapshot: BigInt(newBalance),
          },
        });

        // Redis 캐시 업데이트
        const cacheKey = `point:balance:${dto.userId}`;
        await this.redis.set(cacheKey, String(newBalance), this.CACHE_TTL);

        // Kafka 이벤트 발행
        await this.kafka.emit('point.earned', {
          id: Number(point.id),
          userId: dto.userId,
          amount: dto.amount,
          newBalance,
          createdAt: point.createdAt.toISOString(),
        });

        this.logger.log(`Points earned successfully: ${point.id}`);
        return point;
      });
    });
  }

  async usePoints(dto: UsePointsDto): Promise<Point> {
    this.logger.log(`Using ${dto.amount} points for user ${dto.userId}`);

    return this.retryOnConflict(async () => {
      return await this.prisma.$transaction(async (tx) => {
        const balance = await tx.pointBalance.findUnique({
          where: { userId: BigInt(dto.userId) },
        });

        if (!balance) {
          throw new NotFoundException(`User ${dto.userId} has no point balance`);
        }

        const currentBalance = Number(balance.balance);

        if (currentBalance < dto.amount) {
          throw new BadRequestException(
            `Insufficient points. Available: ${currentBalance}, Requested: ${dto.amount}`,
          );
        }

        const newBalance = currentBalance - dto.amount;

        // Optimistic Locking으로 잔액 업데이트
        const updated = await tx.pointBalance.updateMany({
          where: {
            userId: BigInt(dto.userId),
            version: balance.version,
          },
          data: {
            balance: BigInt(newBalance),
            version: { increment: 1 },
          },
        });

        if (updated.count === 0) {
          throw new ConflictException('Point balance was modified by another transaction');
        }

        // 포인트 트랜잭션 기록
        const point = await tx.point.create({
          data: {
            userId: BigInt(dto.userId),
            amount: BigInt(-dto.amount),
            type: PointType.SPENT,
            description: dto.description,
            balanceSnapshot: BigInt(newBalance),
          },
        });

        // Redis 캐시 업데이트
        const cacheKey = `point:balance:${dto.userId}`;
        await this.redis.set(cacheKey, String(newBalance), this.CACHE_TTL);

        // Kafka 이벤트 발행
        await this.kafka.emit('point.spent', {
          id: Number(point.id),
          userId: dto.userId,
          amount: dto.amount,
          newBalance,
          createdAt: point.createdAt.toISOString(),
        });

        this.logger.log(`Points used successfully: ${point.id}`);
        return point;
      });
    });
  }

  async cancelPoints(dto: CancelPointsDto): Promise<Point> {
    this.logger.log(`Canceling transaction ${dto.transactionId}`);

    return this.retryOnConflict(async () => {
      return await this.prisma.$transaction(async (tx) => {
        const originalTransaction = await tx.point.findUnique({
          where: { id: BigInt(dto.transactionId) },
        });

        if (!originalTransaction) {
          throw new NotFoundException(
            `Transaction ${dto.transactionId} not found`,
          );
        }

        if (originalTransaction.type === PointType.CANCELED) {
          throw new BadRequestException('Transaction already canceled');
        }

        const balance = await tx.pointBalance.findUnique({
          where: { userId: originalTransaction.userId },
        });

        if (!balance) {
          throw new NotFoundException(
            `User ${originalTransaction.userId} has no point balance`,
          );
        }

        const currentBalance = Number(balance.balance);
        const refundAmount = Number(originalTransaction.amount);
        const newBalance = currentBalance - refundAmount;

        // Optimistic Locking으로 잔액 업데이트
        const updated = await tx.pointBalance.updateMany({
          where: {
            userId: originalTransaction.userId,
            version: balance.version,
          },
          data: {
            balance: BigInt(newBalance),
            version: { increment: 1 },
          },
        });

        if (updated.count === 0) {
          throw new ConflictException('Point balance was modified by another transaction');
        }

        // 취소 트랜잭션 기록
        const point = await tx.point.create({
          data: {
            userId: originalTransaction.userId,
            amount: BigInt(-refundAmount),
            type: PointType.CANCELED,
            description: dto.description,
            balanceSnapshot: BigInt(newBalance),
          },
        });

        // Redis 캐시 업데이트
        const cacheKey = `point:balance:${Number(originalTransaction.userId)}`;
        await this.redis.set(cacheKey, String(newBalance), this.CACHE_TTL);

        // Kafka 이벤트 발행
        await this.kafka.emit('point.canceled', {
          id: Number(point.id),
          userId: Number(originalTransaction.userId),
          originalTransactionId: dto.transactionId,
          newBalance,
          createdAt: point.createdAt.toISOString(),
        });

        this.logger.log(`Points canceled successfully: ${point.id}`);
        return point;
      });
    });
  }

  async getBalance(userId: number): Promise<{ userId: number; balance: number }> {
    // Redis 캐시 조회
    const cacheKey = `point:balance:${userId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached !== null) {
      this.logger.debug(`Cache hit for user ${userId} balance`);
      return {
        userId,
        balance: parseInt(cached, 10),
      };
    }

    // 캐시 미스 시 DB 조회
    this.logger.debug(`Cache miss for user ${userId} balance, fetching from DB`);
    const balance = await this.prisma.pointBalance.findUnique({
      where: { userId: BigInt(userId) },
    });

    const balanceValue = balance ? Number(balance.balance) : 0;

    // Redis에 캐시 저장
    await this.redis.set(cacheKey, String(balanceValue), this.CACHE_TTL);

    return {
      userId,
      balance: balanceValue,
    };
  }

  async getHistory(
    userId: number,
    page = 0,
    size = 10,
  ): Promise<{ points: Point[]; total: number }> {
    const [points, total] = await Promise.all([
      this.prisma.point.findMany({
        where: { userId: BigInt(userId) },
        skip: page * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.point.count({
        where: { userId: BigInt(userId) },
      }),
    ]);

    return { points, total };
  }

  private async retryOnConflict<T>(
    operation: () => Promise<T>,
    retries = this.MAX_RETRIES,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (
        error instanceof ConflictException &&
        retries > 0
      ) {
        this.logger.warn(`Retrying operation, ${retries} attempts remaining`);
        await this.delay(100);
        return this.retryOnConflict(operation, retries - 1);
      }
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
