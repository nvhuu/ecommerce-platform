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

  static toDomain(data: any): Category | null {
    if (!data) return null;
    const category = new Category();
    category.id = data.id;
    category.name = data.name;
    category.slug = data.slug;
    category.parentId = data.parentId;

    // Recursively transform children, filtering soft-deleted
    if (data.children) {
      category.children = data.children
        .filter((c: any) => !c.deletedAt)
        .map((c: any) => Category.toDomain(c))
        .filter((c: Category | null): c is Category => c !== null);
    }

    // Transform parent if present and not soft-deleted
    if (data.parent && !data.parent.deletedAt) {
      const parent = Category.toDomain(data.parent);
      if (parent) category.parent = parent;
    }

    category.createdAt = data.createdAt;
    category.updatedAt = data.updatedAt;
    category.createdBy = data.createdBy;
    category.updatedBy = data.updatedBy;
    category.deletedAt = data.deletedAt;
    category.deletedBy = data.deletedBy;
    return category;
  }
}
