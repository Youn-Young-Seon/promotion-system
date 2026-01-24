import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UseCouponDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  orderId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  orderAmount!: number;
}
