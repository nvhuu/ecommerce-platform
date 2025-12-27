import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty({ description: 'Product ID to add to wishlist' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({
    description: 'Product variant ID (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  variantId?: string;
}
