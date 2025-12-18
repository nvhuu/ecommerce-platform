import { ApiProperty } from '@nestjs/swagger';
import { ReturnReason, ReturnStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateReturnItemDto {
  @ApiProperty()
  @IsString()
  productId!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  variantId?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class CreateReturnDto {
  @ApiProperty()
  @IsString()
  orderId!: string;

  @ApiProperty({ enum: ReturnReason })
  @IsEnum(ReturnReason)
  reason!: ReturnReason;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ type: [CreateReturnItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnItemDto)
  items!: CreateReturnItemDto[];
}

export class UpdateReturnStatusDto {
  @ApiProperty({ enum: ReturnStatus })
  @IsEnum(ReturnStatus)
  status!: ReturnStatus;
}

export class ReturnItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  productId!: string;

  @ApiProperty()
  variantId?: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  refundAmount!: number;

  @ApiProperty()
  reason?: string;
}

export class ReturnResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: ReturnStatus })
  status!: ReturnStatus;

  @ApiProperty({ enum: ReturnReason })
  reason!: ReturnReason;

  @ApiProperty()
  note?: string;

  @ApiProperty({ type: [ReturnItemDto] })
  @Type(() => ReturnItemDto)
  items?: ReturnItemDto[];

  @ApiProperty()
  totalRefund!: number;

  @ApiProperty()
  approvedAt?: Date;

  @ApiProperty()
  approvedBy?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
