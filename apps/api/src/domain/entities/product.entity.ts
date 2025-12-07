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

  static toDomain(data: any): Product | null {
    if (!data) return null;
    const product = new Product();
    product.id = data.id;
    product.name = data.name;
    product.description = data.description;
    product.price = data.price;
    product.stock = data.stock;
    product.images = data.images;
    product.categoryId = data.categoryId;

    // Transform nested category if present and not soft-deleted
    if (data.category && !data.category.deletedAt) {
      const category = Category.toDomain(data.category);
      if (category) product.category = category;
    }

    product.createdAt = data.createdAt;
    product.updatedAt = data.updatedAt;
    product.createdBy = data.createdBy;
    product.updatedBy = data.updatedBy;
    product.deletedAt = data.deletedAt;
    product.deletedBy = data.deletedBy;
    return product;
  }
}
