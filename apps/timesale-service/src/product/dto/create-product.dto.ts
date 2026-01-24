import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
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

  @IsNotEmpty()
  @IsString()
  description!: string;
}
