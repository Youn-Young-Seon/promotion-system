import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, IsDateString, IsEnum } from 'class-validator';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class CreateCouponPolicyDto {
  @ApiProperty({
    description: '쿠폰 정책 제목',
    example: '신규 가입 축하 쿠폰',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    description: '쿠폰 정책 설명',
    example: '신규 가입 고객에게 제공되는 10% 할인 쿠폰',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: '총 발급 가능 수량',
    example: 1000,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  totalQuantity!: number;

  @ApiProperty({
    description: '쿠폰 유효 시작 시간 (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  startTime!: string;

  @ApiProperty({
    description: '쿠폰 유효 종료 시간 (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  endTime!: string;

  @ApiProperty({
    description: '할인 타입',
    enum: DiscountType,
    example: DiscountType.PERCENTAGE,
  })
  @IsEnum(DiscountType)
  discountType!: string;

  @ApiProperty({
    description: '할인 값 (PERCENTAGE: 1-100, FIXED: 금액)',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  discountValue!: number;

  @ApiProperty({
    description: '최소 주문 금액 (선택사항)',
    example: 10000,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minimumOrderAmount?: number;

  @ApiProperty({
    description: '최대 할인 금액 (선택사항)',
    example: 5000,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maximumDiscountAmount?: number;
}
