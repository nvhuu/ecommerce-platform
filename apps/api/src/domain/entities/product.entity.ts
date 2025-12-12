import { Expose, Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';

export class Product extends BaseEntity {
  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  price!: number;

  @Expose()
  stock!: number;

  @Expose()
  images!: string[];

  @Expose()
  categoryId!: string;

  @Expose()
  @Type(() => Category)
  category?: Category;

  static toDomain(input: unknown): Product | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;
    const product = new Product();
    product.id = data.id as string;
    product.name = data.name as string;
    product.description = data.description as string;
    product.price = Number(data.price);
    product.stock = Number(data.stock);
    product.images = Array.isArray(data.images)
      ? (data.images as string[])
      : [];
    product.categoryId = data.categoryId as string;

    // Transform nested category if present and not soft-deleted
    const categoryData = data.category as Record<string, unknown> | undefined;
    if (categoryData && !categoryData.deletedAt) {
      const category = Category.toDomain(categoryData);
      if (category) product.category = category;
    }

    product.createdAt = data.createdAt as Date;
    product.updatedAt = data.updatedAt as Date;
    product.createdBy = data.createdBy as string;
    product.updatedBy = data.updatedBy as string;
    product.deletedAt = data.deletedAt ? (data.deletedAt as Date) : undefined;
    product.deletedBy = data.deletedBy ? (data.deletedBy as string) : undefined;
    return product;
  }
}
