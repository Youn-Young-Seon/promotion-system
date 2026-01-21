import { IsString, IsInt, IsDateString, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimeSaleDto {
    @ApiProperty({ description: '상품 ID', example: '1' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ description: '재고 수량', example: 100, minimum: 1 })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({ description: '할인 가격', example: 9900, minimum: 0 })
    @IsInt()
    @Min(0)
    discountPrice: number;

    @ApiProperty({ description: '시작 시간', example: '2026-01-23T00:00:00Z' })
    @IsDateString()
    startAt: string;

    @ApiProperty({ description: '종료 시간', example: '2026-01-24T23:59:59Z' })
    @IsDateString()
    endAt: string;
}

export class CreateOrderDto {
    @ApiProperty({ description: '사용자 ID', example: '1' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: '주문 수량', example: 1, minimum: 1 })
    @IsInt()
    @Min(1)
    quantity: number;
}

export * from './order-response.dto';
