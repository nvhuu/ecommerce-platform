import { BaseEntity } from '@/shared/domain/base.entity';
import { InventoryTransactionType } from '@prisma/client';
import { Expose } from 'class-transformer';

export class InventoryTransaction extends BaseEntity {
  @Expose()
  productId!: string;

  @Expose()
  variantId?: string;

  @Expose()
  type!: InventoryTransactionType;

  @Expose()
  quantity!: number;

  @Expose()
  reference?: string;

  @Expose()
  note?: string;

  static toDomain(input: unknown): InventoryTransaction | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const transaction = new InventoryTransaction();
    transaction.id = data.id as string;
    transaction.productId = data.productId as string;
    transaction.variantId = data.variantId as string | undefined;
    transaction.type = data.type as InventoryTransactionType;
    transaction.quantity = Number(data.quantity);
    transaction.reference = data.reference as string | undefined;
    transaction.note = data.note as string | undefined;
    transaction.createdBy = data.createdBy as string | undefined;
    transaction.createdAt = data.createdAt as Date;

    return transaction;
  }
}
