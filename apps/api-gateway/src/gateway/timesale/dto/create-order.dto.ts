import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: '타임세일 ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  timeSaleId!: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiProperty({
    description: '주문 수량',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}
