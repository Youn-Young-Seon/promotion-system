import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: '상품명',
    example: '아이폰 15 Pro',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: '상품 가격',
    example: 1500000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  price!: number;

  @ApiProperty({
    description: '상품 설명 (선택사항)',
    example: '최신형 아이폰 15 Pro 256GB',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
