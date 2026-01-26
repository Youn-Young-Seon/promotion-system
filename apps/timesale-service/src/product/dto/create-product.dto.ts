import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
