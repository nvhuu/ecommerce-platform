import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export class ProductVariant extends BaseEntity {
  @Expose()
  productId!: string;

  @Expose()
  sku!: string;

  @Expose()
  name!: string;

  @Expose()
  attributes!: Record<string, unknown>;

  @Expose()
  price!: number;

  @Expose()
  stock!: number;

  @Expose()
  reserved!: number;

  @Expose()
  isActive!: boolean;

  static toDomain(input: unknown): ProductVariant | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const variant = new ProductVariant();
    variant.id = data.id as string;
    variant.productId = data.productId as string;
    variant.sku = data.sku as string;
    variant.name = data.name as string;
    variant.attributes = (data.attributes as Record<string, unknown>) || {};
    variant.price = Number(data.price);
    variant.stock = Number(data.stock);
    variant.reserved = Number(data.reserved);
    variant.isActive = Boolean(data.isActive);

    variant.createdAt = data.createdAt as Date;
    variant.updatedAt = data.updatedAt as Date;

    return variant;
  }
}
