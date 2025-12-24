import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose, Type } from 'class-transformer';
import { User } from '../../../users/domain/entities/user.entity';
import { BlogCategory } from './blog-category.entity';

export enum BlogPostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class BlogPost extends BaseEntity {
  @Expose()
  title!: string;

  @Expose()
  slug!: string;

  @Expose()
  excerpt?: string;

  @Expose()
  content!: string;

  @Expose()
  coverImage?: string;

  @Expose()
  status!: BlogPostStatus;

  @Expose()
  publishedAt?: Date;

  @Expose()
  seoTitle?: string;

  @Expose()
  seoDescription?: string;

  @Expose()
  seoKeywords!: string[];

  @Expose()
  authorId!: string;

  @Expose()
  @Type(() => User)
  author?: User;

  @Expose()
  categoryId!: string;

  @Expose()
  @Type(() => BlogCategory)
  category?: BlogCategory;

  @Expose()
  viewCount!: number;

  static toDomain(input: unknown): BlogPost | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;
    const post = new BlogPost();

    post.id = data.id as string;
    post.title = data.title as string;
    post.slug = data.slug as string;
    post.excerpt = data.excerpt as string | undefined;
    post.content = data.content as string;
    post.coverImage = data.coverImage as string | undefined;
    post.status = data.status as BlogPostStatus;
    post.publishedAt = data.publishedAt
      ? (data.publishedAt as Date)
      : undefined;

    post.seoTitle = data.seoTitle as string | undefined;
    post.seoDescription = data.seoDescription as string | undefined;
    post.seoKeywords = Array.isArray(data.seoKeywords)
      ? (data.seoKeywords as string[])
      : [];

    post.authorId = data.authorId as string;
    post.categoryId = data.categoryId as string;
    post.viewCount = Number(data.viewCount);

    if (data.author && typeof data.author === 'object') {
      const author = User.toDomain(data.author);
      if (author) post.author = author;
    }

    if (data.category && typeof data.category === 'object') {
      const category = BlogCategory.toDomain(data.category);
      if (category) post.category = category;
    }

    post.createdAt = data.createdAt as Date;
    post.updatedAt = data.updatedAt as Date;

    return post;
  }
}
