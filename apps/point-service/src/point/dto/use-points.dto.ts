import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UsePointsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;
}
