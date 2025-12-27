import { Expose } from 'class-transformer';
import { BaseEntity } from '@/shared/domain/base.entity';
import { WishlistItem } from './wishlist-item.entity';

export class Wishlist extends BaseEntity {

  @Expose()
  userId!: string;

  @Expose()
  isPublic!: boolean;

  @Expose()
  shareToken?: string;

  @Expose()
  items?: WishlistItem[];



  static toDomain(input: unknown): Wishlist | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const entity = new Wishlist();
    entity.id = data.id as string;
    entity.userId = data.userId as string;
    entity.isPublic = data.isPublic as boolean;
    entity.shareToken = data.shareToken as string | undefined;
    entity.createdAt = data.createdAt as Date;
    entity.updatedAt = data.updatedAt as Date;

    // Map items if present
    if (Array.isArray(data.items)) {
      entity.items = data.items
        .map((item) => WishlistItem.toDomain(item))
        .filter((item): item is WishlistItem => item !== null);
    }

    return entity;
  }
}
