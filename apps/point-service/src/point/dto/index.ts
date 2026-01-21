import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPointDto {
    @ApiProperty({ description: '사용자 ID', example: '1' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: '적립 포인트', example: 1000, minimum: 1 })
    @IsInt()
    @Min(1)
    amount: number;

    @ApiProperty({ description: '적립 사유', example: '상품 구매 적립' })
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UsePointDto {
    @ApiProperty({ description: '사용자 ID', example: '1' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: '사용 포인트', example: 500, minimum: 1 })
    @IsInt()
    @Min(1)
    amount: number;

    @ApiProperty({ description: '사용 사유', example: '상품 구매 시 사용' })
    @IsString()
    @IsNotEmpty()
    description: string;
}
