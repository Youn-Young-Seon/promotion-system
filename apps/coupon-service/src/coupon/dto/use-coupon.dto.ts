import { IsString, IsNotEmpty } from 'class-validator';

export class UseCouponDto {
    @IsString()
    @IsNotEmpty()
    couponId: string;

    @IsString()
    @IsNotEmpty()
    orderId: string;
}
