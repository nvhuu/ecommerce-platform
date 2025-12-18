import { InventoryTransaction } from '../entities/inventory-transaction.entity';

export interface IInventoryTransactionRepository {
  create(
    transaction: Partial<InventoryTransaction>,
  ): Promise<InventoryTransaction>;
  findByProduct(
    productId: string,
    variantId?: string,
  ): Promise<InventoryTransaction[]>;
}
