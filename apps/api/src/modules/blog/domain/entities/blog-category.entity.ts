import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export class BlogCategory extends BaseEntity {
  @Expose()
  name!: string;

  @Expose()
  slug!: string;

  @Expose()
  description?: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  seoTitle?: string;

  @Expose()
  seoDescription?: string;

  @Expose()
  seoKeywords!: string[];

  static toDomain(input: unknown): BlogCategory | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;
    const category = new BlogCategory();

    category.id = data.id as string;
    category.name = data.name as string;
    category.slug = data.slug as string;
    category.description = data.description as string | undefined;
    category.isActive = Boolean(data.isActive);

    category.seoTitle = data.seoTitle as string | undefined;
    category.seoDescription = data.seoDescription as string | undefined;
    category.seoKeywords = Array.isArray(data.seoKeywords)
      ? (data.seoKeywords as string[])
      : [];

    category.createdAt = data.createdAt as Date;
    category.updatedAt = data.updatedAt as Date;

    return category;
  }
}
