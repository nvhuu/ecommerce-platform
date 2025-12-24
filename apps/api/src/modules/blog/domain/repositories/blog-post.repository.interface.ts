import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { BlogPost, BlogPostStatus } from '../entities/blog-post.entity';

export interface BlogFilterOptions extends PaginationOptions {
  categoryId?: string;
  status?: BlogPostStatus;
  authorId?: string;
}

export interface IBlogPostRepository {
  create(post: Partial<BlogPost>): Promise<BlogPost>;
  findAll(options: BlogFilterOptions): Promise<PaginatedResult<BlogPost>>;
  findById(id: string): Promise<BlogPost | null>;
  findBySlug(slug: string): Promise<BlogPost | null>;
  update(id: string, post: Partial<BlogPost>): Promise<BlogPost>;
  delete(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
}
