import { IsNotEmpty, IsString, IsInt, Min, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export enum DiscountType {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  PERCENTAGE = 'PERCENTAGE',
}

export class CreateCouponPolicyDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  totalQuantity!: number;

  @IsNotEmpty()
  @IsDateString()
  startTime!: string;

  @IsNotEmpty()
  @IsDateString()
  endTime!: string;

  @IsNotEmpty()
  @IsEnum(DiscountType)
  discountType!: DiscountType;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  discountValue!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minimumOrderAmount!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maximumDiscountAmount!: number;
}
