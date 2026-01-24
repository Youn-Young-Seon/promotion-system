import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RedisService, KafkaService } from '@common/index';
import { PrismaService } from '../prisma/prisma.service';
import { IssueCouponDto, UseCouponDto } from './dto';
import { Coupon, CouponStatus } from '../../prisma/generated/client';

@Injectable()
export class CouponService {
  private readonly logger = new Logger(CouponService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly kafka: KafkaService,
  ) {}

  async issueCoupon(dto: IssueCouponDto): Promise<Coupon> {
    this.logger.log(`Issuing coupon for user ${dto.userId}, policy ${dto.couponPolicyId}`);

    // 분산 락을 사용하여 동시성 제어
    const lockKey = `coupon:policy:${dto.couponPolicyId}`;

    return await this.redis.executeWithLock(
      lockKey,
      async () => {
        return await this.prisma.$transaction(async (tx) => {
          // 쿠폰 정책 조회
          const policy = await tx.couponPolicy.findUnique({
            where: { id: BigInt(dto.couponPolicyId) },
          });

          if (!policy) {
            throw new NotFoundException(
              `Coupon policy with ID ${dto.couponPolicyId} not found`,
            );
          }

          // 현재 시간 체크
          const now = new Date();
          if (now < policy.startTime || now > policy.endTime) {
            throw new BadRequestException('Coupon policy is not active');
          }

          // 수량 체크
          if (policy.issuedQuantity >= policy.totalQuantity) {
            throw new BadRequestException('Coupon sold out');
          }

          // 쿠폰 발급
          const expirationTime = new Date(policy.endTime);
          const coupon = await tx.coupon.create({
            data: {
              couponPolicyId: BigInt(dto.couponPolicyId),
              userId: BigInt(dto.userId),
              status: CouponStatus.AVAILABLE,
              expirationTime,
            },
            include: {
              couponPolicy: true,
            },
          });

          // 발급 수량 증가
          await tx.couponPolicy.update({
            where: { id: BigInt(dto.couponPolicyId) },
            data: {
              issuedQuantity: { increment: 1 },
            },
          });

          // Kafka 이벤트 발행
          await this.kafka.emit('coupon.issued', {
            id: Number(coupon.id),
            userId: dto.userId,
            couponPolicyId: dto.couponPolicyId,
            issuedAt: coupon.issuedAt.toISOString(),
          });

          this.logger.log(`Coupon issued successfully: ${coupon.id}`);
          return coupon;
        });
      },
      10000, // 10초 락 타임아웃
    );
  }

  async useCoupon(couponId: number, dto: UseCouponDto): Promise<Coupon> {
    this.logger.log(`Using coupon ${couponId} for order ${dto.orderId}`);

    return await this.prisma.$transaction(async (tx) => {
      const coupon = await tx.coupon.findUnique({
        where: { id: BigInt(couponId) },
        include: { couponPolicy: true },
      });

      if (!coupon) {
        throw new NotFoundException(`Coupon with ID ${couponId} not found`);
      }

      if (coupon.status !== CouponStatus.AVAILABLE) {
        throw new BadRequestException(`Coupon is not available for use`);
      }

      // 만료 시간 체크
      if (new Date() > coupon.expirationTime) {
        await tx.coupon.update({
          where: { id: BigInt(couponId) },
          data: { status: CouponStatus.EXPIRED },
        });
        throw new BadRequestException('Coupon has expired');
      }

      // 최소 주문 금액 체크
      if (dto.orderAmount < coupon.couponPolicy.minimumOrderAmount) {
        throw new BadRequestException(
          `Order amount must be at least ${coupon.couponPolicy.minimumOrderAmount}`,
        );
      }

      // 쿠폰 사용 처리
      const updatedCoupon = await tx.coupon.update({
        where: { id: BigInt(couponId) },
        data: {
          status: CouponStatus.USED,
          orderId: BigInt(dto.orderId),
          usedAt: new Date(),
        },
        include: { couponPolicy: true },
      });

      // Kafka 이벤트 발행
      await this.kafka.emit('coupon.used', {
        id: Number(updatedCoupon.id),
        userId: Number(updatedCoupon.userId),
        orderId: dto.orderId,
        usedAt: updatedCoupon.usedAt?.toISOString(),
      });

      this.logger.log(`Coupon used successfully: ${couponId}`);
      return updatedCoupon;
    });
  }

  async cancelCoupon(couponId: number): Promise<Coupon> {
    this.logger.log(`Canceling coupon ${couponId}`);

    const coupon = await this.prisma.coupon.findUnique({
      where: { id: BigInt(couponId) },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${couponId} not found`);
    }

    if (coupon.status !== CouponStatus.USED) {
      throw new BadRequestException('Only used coupons can be canceled');
    }

    const canceledCoupon = await this.prisma.coupon.update({
      where: { id: BigInt(couponId) },
      data: {
        status: CouponStatus.CANCELED,
        orderId: null,
        usedAt: null,
      },
      include: { couponPolicy: true },
    });

    // Kafka 이벤트 발행
    await this.kafka.emit('coupon.canceled', {
      id: Number(canceledCoupon.id),
      userId: Number(canceledCoupon.userId),
      canceledAt: new Date().toISOString(),
    });

    this.logger.log(`Coupon canceled successfully: ${couponId}`);
    return canceledCoupon;
  }

  async getUserCoupons(userId: number): Promise<Coupon[]> {
    return this.prisma.coupon.findMany({
      where: { userId: BigInt(userId) },
      include: { couponPolicy: true },
      orderBy: { issuedAt: 'desc' },
    });
  }
}
