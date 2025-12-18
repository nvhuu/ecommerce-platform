import { ApiProperty } from '@nestjs/swagger';
import { CouponType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty({ enum: CouponType })
  @IsEnum(CouponType)
  type!: CouponType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  value!: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderAmount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDiscount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  usageLimit?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  perUserLimit?: number;

  @ApiProperty()
  @IsDateString()
  startDate!: string;

  @ApiProperty()
  @IsDateString()
  endDate!: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateCouponDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class ValidateCouponDto {
  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  orderTotal!: number;

  @ApiProperty()
  @IsString()
  userId!: string;
}

export class CouponResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty({ enum: CouponType })
  type!: CouponType;

  @ApiProperty()
  value!: number;

  @ApiProperty()
  minOrderAmount?: number;

  @ApiProperty()
  maxDiscount?: number;

  @ApiProperty()
  usageLimit?: number;

  @ApiProperty()
  usageCount!: number;

  @ApiProperty()
  perUserLimit?: number;

  @ApiProperty()
  startDate!: Date;

  @ApiProperty()
  endDate!: Date;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class CouponValidationResultDto {
  @ApiProperty()
  valid!: boolean;

  @ApiProperty()
  discountAmount?: number;

  @ApiProperty({ required: false })
  message?: string;
}
