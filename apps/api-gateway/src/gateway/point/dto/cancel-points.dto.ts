import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CancelPointsDto {
  @ApiProperty({
    description: '취소할 거래 ID',
    example: 123,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  transactionId!: number;

  @ApiProperty({
    description: '취소 사유',
    example: '주문 취소로 인한 포인트 환불',
  })
  @IsString()
  description!: string;
}
