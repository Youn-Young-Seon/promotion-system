import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional } from 'class-validator';

export class UseCouponDto {
  @ApiProperty({
    description: '주문 ID (선택사항)',
    example: 12345,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  orderId?: number;

  @ApiProperty({
    description: '주문 금액',
    example: 50000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  orderAmount!: number;
}
