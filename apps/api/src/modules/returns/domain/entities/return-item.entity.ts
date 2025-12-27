import { Expose } from 'class-transformer';
import { BaseEntity } from '@/shared/domain/base.entity';

export class ReturnItem extends BaseEntity {

  @Expose()
  returnId!: string;

  @Expose()
  productId!: string;

  @Expose()
  variantId?: string;

  @Expose()
  quantity!: number;

  @Expose()
  refundAmount!: number;

  @Expose()
  reason?: string;

  static toDomain(input: unknown): ReturnItem | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const item = new ReturnItem();
    item.id = data.id as string;
    item.returnId = data.returnId as string;
    item.productId = data.productId as string;
    item.variantId = data.variantId as string;
    item.quantity = Number(data.quantity);
    item.refundAmount = Number(data.refundAmount);
    item.reason = data.reason as string;

    return item;
  }
}
