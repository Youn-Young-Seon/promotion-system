import { IsString, IsInt, IsDateString, IsEnum, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DiscountType {
    FIXED_AMOUNT = 'FIXED_AMOUNT',
    PERCENTAGE = 'PERCENTAGE',
}

export class CreateCouponPolicyDto {
    @ApiProperty({ description: '쿠폰 제목', example: '신년 맞이 쿠폰' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: '쿠폰 설명', example: '모든 상품 10% 할인' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: '총 발급 수량', example: 1000, minimum: 1 })
    @IsInt()
    @Min(1)
    totalQuantity: number;

    @ApiProperty({ description: '시작 시간', example: '2026-01-23T00:00:00Z' })
    @IsDateString()
    startTime: string;

    @ApiProperty({ description: '종료 시간', example: '2026-01-31T23:59:59Z' })
    @IsDateString()
    endTime: string;

    @ApiProperty({ description: '할인 타입', enum: DiscountType, example: DiscountType.PERCENTAGE })
    @IsEnum(DiscountType)
    discountType: DiscountType;

    @ApiProperty({ description: '할인 값 (금액 또는 퍼센트)', example: 10, minimum: 1 })
    @IsInt()
    @Min(1)
    discountValue: number;

    @ApiProperty({ description: '최소 주문 금액', example: 10000, minimum: 0 })
    @IsInt()
    @Min(0)
    minimumOrderAmount: number;

    @ApiProperty({ description: '최대 할인 금액', example: 5000, minimum: 0 })
    @IsInt()
    @Min(0)
    maximumDiscountAmount: number;
}

export class IssueCouponDto {
    @ApiProperty({ description: '쿠폰 정책 ID', example: '1' })
    @IsString()
    @IsNotEmpty()
    policyId: string;

    @ApiProperty({ description: '사용자 ID', example: '1' })
    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class UseCouponDto {
    @ApiProperty({ description: '쿠폰 ID', example: '1' })
    @IsString()
    @IsNotEmpty()
    couponId: string;

    @ApiProperty({ description: '주문 ID', example: '1' })
    @IsString()
    @IsNotEmpty()
    orderId: string;
}

export * from './coupon-response.dto';
