import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductVariantResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Variant ID',
    example: '507f1f77bcf86cd799439011',
  })
  id!: string;

  @Expose()
  @ApiProperty({
    description: 'Product ID',
    example: '507f1f77bcf86cd799439012',
  })
  productId!: string;

  @Expose()
  @ApiProperty({
    description: 'Variant SKU',
    example: 'PHONE-128GB-RED',
  })
  sku!: string;

  @Expose()
  @ApiProperty({
    description: 'Variant name',
    example: 'Red - 128GB',
  })
  name!: string;

  @Expose()
  @ApiProperty({
    description: 'Variant attributes',
    example: { color: 'red', storage: '128GB' },
  })
  attributes!: Record<string, unknown>;

  @Expose()
  @ApiProperty({
    description: 'Variant price',
    example: 999.99,
  })
  price!: number;

  @Expose()
  @ApiProperty({
    description: 'Stock quantity',
    example: 50,
  })
  stock!: number;

  @Expose()
  @ApiProperty({
    description: 'Reserved stock',
    example: 5,
  })
  reserved!: number;

  @Expose()
  @ApiProperty({
    description: 'Is active',
    example: true,
  })
  isActive!: boolean;

  @Expose()
  @ApiProperty({
    description: 'Created at',
    example: '2025-12-18T14:00:00Z',
  })
  createdAt!: Date;

  @Expose()
  @ApiProperty({
    description: 'Updated at',
    example: '2025-12-18T14:00:00Z',
  })
  updatedAt!: Date;
}
