import { Expose } from 'class-transformer';

export class WishlistItem {
  @Expose()
  id!: string;

  @Expose()
  wishlistId!: string;

  @Expose()
  productId!: string;

  @Expose()
  variantId?: string;

  @Expose()
  addedAt!: Date;

  static toDomain(input: unknown): WishlistItem | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const entity = new WishlistItem();
    entity.id = data.id as string;
    entity.wishlistId = data.wishlistId as string;
    entity.productId = data.productId as string;
    entity.variantId = data.variantId as string | undefined;
    entity.addedAt = data.addedAt as Date;

    return entity;
  }
}
