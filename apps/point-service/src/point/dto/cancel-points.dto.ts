import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CancelPointsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  transactionId!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;
}
