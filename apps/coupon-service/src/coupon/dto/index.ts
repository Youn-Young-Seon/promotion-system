import { IsString, IsInt, IsDateString, IsEnum, Min, IsNotEmpty } from 'class-validator';

export enum DiscountType {
    FIXED_AMOUNT = 'FIXED_AMOUNT',
    PERCENTAGE = 'PERCENTAGE',
}

export class CreateCouponPolicyDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsInt()
    @Min(1)
    totalQuantity: number;

    @IsDateString()
    startTime: string;

    @IsDateString()
    endTime: string;

    @IsEnum(DiscountType)
    discountType: DiscountType;

    @IsInt()
    @Min(1)
    discountValue: number;

    @IsInt()
    @Min(0)
    minimumOrderAmount: number;

    @IsInt()
    @Min(0)
    maximumDiscountAmount: number;
}

export class IssueCouponDto {
    @IsString()
    @IsNotEmpty()
    policyId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class UseCouponDto {
    @IsString()
    @IsNotEmpty()
    couponId: string;

    @IsString()
    @IsNotEmpty()
    orderId: string;
}
