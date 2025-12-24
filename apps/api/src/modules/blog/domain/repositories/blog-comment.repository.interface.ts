import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { BlogComment } from '../entities/blog-comment.entity';

export interface BlogCommentFilterOptions extends PaginationOptions {
  postId?: string;
  isApproved?: boolean;
}

export interface IBlogCommentRepository {
  create(comment: Partial<BlogComment>): Promise<BlogComment>;
  findAll(
    options: BlogCommentFilterOptions,
  ): Promise<PaginatedResult<BlogComment>>;
  findById(id: string): Promise<BlogComment | null>;
  update(id: string, comment: Partial<BlogComment>): Promise<BlogComment>;
  delete(id: string): Promise<void>;
  countByPostId(postId: string): Promise<number>;
}
