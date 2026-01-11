import { IsString, IsInt, IsDateString, IsNotEmpty, Min } from 'class-validator';

export class CreateTimeSaleDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsInt()
    @Min(0)
    discountPrice: number;

    @IsDateString()
    startAt: string;

    @IsDateString()
    endAt: string;
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}
