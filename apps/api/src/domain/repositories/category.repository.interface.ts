import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
  create(category: Partial<Category>): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  update(id: string, category: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
}
