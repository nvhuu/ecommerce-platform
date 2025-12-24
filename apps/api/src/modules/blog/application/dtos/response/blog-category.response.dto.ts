import { Expose } from 'class-transformer';

export class BlogCategoryResponseDto {
  @Expose()
  id!: string;

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

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
