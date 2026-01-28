import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class IssueCouponDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiProperty({
    description: '쿠폰 정책 ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  couponPolicyId!: number;
}
