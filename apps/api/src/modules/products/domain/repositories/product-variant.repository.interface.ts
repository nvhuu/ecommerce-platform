import { ProductVariant } from '../entities/product-variant.entity';

export interface IProductVariantRepository {
  findAll(productId: string): Promise<ProductVariant[]>;
  findById(id: string): Promise<ProductVariant | null>;
  findBySku(sku: string): Promise<ProductVariant | null>;
  create(variant: Partial<ProductVariant>): Promise<ProductVariant>;
  update(id: string, variant: Partial<ProductVariant>): Promise<ProductVariant>;
  delete(id: string): Promise<void>;
  reserveStock(variantId: string, quantity: number): Promise<void>;
  releaseStock(variantId: string, quantity: number): Promise<void>;
  deductStock(variantId: string, quantity: number): Promise<void>;
}
