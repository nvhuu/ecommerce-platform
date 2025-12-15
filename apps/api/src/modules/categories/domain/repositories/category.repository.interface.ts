import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
  findAll(options: PaginationOptions): Promise<PaginatedResult<Category>>;
  findById(id: string): Promise<Category | null>;
  findByParentId(parentId: string | null): Promise<Category[]>;
  create(category: Category): Promise<Category>;
  update(id: string, category: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
}
