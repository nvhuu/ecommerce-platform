import { Expose, Type } from 'class-transformer';

class WishlistItemProductDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  slug!: string;

  @Expose()
  price!: number;

  @Expose()
  imageUrl?: string;
}

class WishlistItemVariantDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  sku!: string;

  @Expose()
  price!: number;
}

export class WishlistItemResponseDto {
  @Expose()
  id!: string;

  @Expose()
  @Type(() => WishlistItemProductDto)
  product!: WishlistItemProductDto;

  @Expose()
  @Type(() => WishlistItemVariantDto)
  variant?: WishlistItemVariantDto;

  @Expose()
  addedAt!: Date;
}

export class WishlistResponseDto {
  @Expose()
  id!: string;

  @Expose()
  userId!: string;

  @Expose()
  @Type(() => WishlistItemResponseDto)
  items!: WishlistItemResponseDto[];

  @Expose()
  isPublic!: boolean;

  @Expose()
  shareToken?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
