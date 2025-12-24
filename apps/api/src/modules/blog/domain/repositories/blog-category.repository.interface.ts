import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { BlogCategory } from '../entities/blog-category.entity';

export interface IBlogCategoryRepository {
  create(category: Partial<BlogCategory>): Promise<BlogCategory>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<BlogCategory>>;
  findById(id: string): Promise<BlogCategory | null>;
  findBySlug(slug: string): Promise<BlogCategory | null>;
  update(id: string, category: Partial<BlogCategory>): Promise<BlogCategory>;
  delete(id: string): Promise<void>;
}
