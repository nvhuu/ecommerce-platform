import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class RedeemPointsDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  points!: number;
}

export class AdjustPointsDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsInt()
  @Type(() => Number)
  points!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class GetTransactionsQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
