import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString, Min } from 'class-validator';

export class CreateTimeSaleDto {
  @ApiProperty({
    description: '상품 ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  productId!: number;

  @ApiProperty({
    description: '판매 수량',
    example: 100,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    description: '할인 가격',
    example: 1200000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  discountPrice!: number;

  @ApiProperty({
    description: '타임세일 시작 시간 (ISO 8601)',
    example: '2024-01-01T10:00:00Z',
  })
  @IsDateString()
  startAt!: string;

  @ApiProperty({
    description: '타임세일 종료 시간 (ISO 8601)',
    example: '2024-01-01T12:00:00Z',
  })
  @IsDateString()
  endAt!: string;
}
