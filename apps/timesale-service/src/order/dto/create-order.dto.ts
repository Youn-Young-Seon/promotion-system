import { IsNotEmpty, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  timeSaleId!: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  userId!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}
