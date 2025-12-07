import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
  create(category: Partial<Category>): Promise<Category>;
  findAll(options: { cursor?: string; page?: number; limit: number }): Promise<{
    data: Category[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }>;
  findById(id: string): Promise<Category | null>;
  update(id: string, category: Partial<Category>): Promise<Category>;
  delete(id: string, deletedBy?: string): Promise<void>;
}
