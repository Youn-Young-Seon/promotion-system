import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddPointDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsInt()
    @Min(1)
    amount: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UsePointDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsInt()
    @Min(1)
    amount: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}
