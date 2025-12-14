import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productId!: string;

  @ApiProperty({
    description: 'Quantity to order',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Shipping Address (JSON string or plain text)',
    example: '123 Main St, New York, NY 10001',
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress!: string;

  @ApiProperty({
    description: 'Payment Method',
    example: 'COD',
    default: 'COD',
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
