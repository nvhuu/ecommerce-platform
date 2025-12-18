import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { Product } from '../entities/product.entity';

export interface ProductFilterOptions extends PaginationOptions {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface IProductRepository {
  findAll(options: ProductFilterOptions): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  findByCategory(
    categoryId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResult<Product>>;
  findRelated(productId: string): Promise<Product[]>;
  create(product: Partial<Product>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}
