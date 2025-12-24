import { UserResponseDto } from '@/modules/users/application/dtos/response/user.response.dto';
import { Expose, Type } from 'class-transformer';
import { BlogPostStatus } from '../../../domain/entities/blog-post.entity';
import { BlogCategoryResponseDto } from './blog-category.response.dto';

export class BlogPostResponseDto {
  @Expose()
  id!: string;

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
  @Type(() => UserResponseDto)
  author?: UserResponseDto;

  @Expose()
  categoryId!: string;

  @Expose()
  @Type(() => BlogCategoryResponseDto)
  category?: BlogCategoryResponseDto;

  @Expose()
  viewCount!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
