import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class IssueCouponDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  couponPolicyId!: number;
}
