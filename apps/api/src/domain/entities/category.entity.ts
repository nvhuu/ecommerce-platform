import { Expose } from 'class-transformer';
import { BaseEntity } from './base.entity';

export class Category extends BaseEntity {
  @Expose()
  name!: string;

  @Expose()
  slug!: string;

  @Expose()
  parentId?: string | null;

  @Expose()
  children?: Category[];

  @Expose()
  parent?: Category;

  static toDomain(input: unknown): Category | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;
    const category = new Category();
    category.id = data.id as string;
    category.name = data.name as string;
    category.slug = data.slug as string;
    category.parentId = data.parentId as string | null; // or undefined? BaseEntity has optional? No, Category has ? | null

    // Recursively transform children, filtering soft-deleted
    if (Array.isArray(data.children)) {
      category.children = data.children
        .filter((c) => !(c as Record<string, unknown>).deletedAt)
        .map((c) => Category.toDomain(c))
        .filter((c): c is Category => c !== null);
    }

    // Transform parent if present and not soft-deleted
    const parentData = data.parent as Record<string, unknown> | undefined;
    if (parentData && !parentData.deletedAt) {
      const parent = Category.toDomain(parentData);
      if (parent) category.parent = parent;
    }

    category.createdAt = data.createdAt as Date;
    category.updatedAt = data.updatedAt as Date;
    category.createdBy = data.createdBy as string;
    category.updatedBy = data.updatedBy as string;
    category.deletedAt = data.deletedAt ? (data.deletedAt as Date) : undefined;
    category.deletedBy = data.deletedBy
      ? (data.deletedBy as string)
      : undefined;
    return category;
  }
}
