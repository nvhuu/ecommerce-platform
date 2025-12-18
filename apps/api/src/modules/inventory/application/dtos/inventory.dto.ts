import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryTransactionType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInventoryTransactionDto {
  @ApiProperty({
    description: 'Product ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiPropertyOptional({
    description: 'Variant ID (if transaction is for a variant)',
    example: '507f1f77bcf86cd799439012',
  })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({
    description: 'Transaction type',
    enum: InventoryTransactionType,
    example: InventoryTransactionType.PURCHASE,
  })
  @IsEnum(InventoryTransactionType)
  type!: InventoryTransactionType;

  @ApiProperty({
    description: 'Quantity (positive for stock in, negative for stock out)',
    example: 100,
  })
  @IsNumber()
  quantity!: number;

  @ApiPropertyOptional({
    description: 'Reference (Order ID, PO number, etc.)',
    example: 'ORDER-12345',
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Received from supplier XYZ',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
