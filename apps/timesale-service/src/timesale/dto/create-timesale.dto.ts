import { IsNotEmpty, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTimeSaleDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  productId!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  discountPrice!: number;

  @IsNotEmpty()
  @IsDateString()
  startAt!: string;

  @IsNotEmpty()
  @IsDateString()
  endAt!: string;
}
