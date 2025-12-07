import { Product } from '../entities/product.entity';

export interface IProductRepository {
  create(product: Partial<Product>): Promise<Product>;
  findAll(options: { cursor?: string; page?: number; limit: number }): Promise<{
    data: Product[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }>;
  findById(id: string): Promise<Product | null>;
  findByCategory(
    categoryId: string,
    options: {
      cursor?: string;
      page?: number;
      limit: number;
    },
  ): Promise<{
    data: Product[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string, deletedBy?: string): Promise<void>;
}
