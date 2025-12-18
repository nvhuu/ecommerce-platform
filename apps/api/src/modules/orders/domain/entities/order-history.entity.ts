import { BaseEntity } from '@/shared/domain/base.entity';
import { OrderStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class OrderHistory extends BaseEntity {
  @Expose()
  orderId!: string;

  @Expose()
  fromStatus?: OrderStatus;

  @Expose()
  toStatus!: OrderStatus;

  @Expose()
  note?: string;

  @Expose()
  changedAt!: Date;

  @Expose()
  changedBy?: string;

  static toDomain(input: unknown): OrderHistory | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const history = new OrderHistory();
    history.id = data.id as string;
    history.orderId = data.orderId as string;
    history.fromStatus = data.fromStatus as OrderStatus | undefined;
    history.toStatus = data.toStatus as OrderStatus;
    history.note = data.note as string | undefined;
    history.changedAt = data.changedAt as Date;
    history.changedBy = data.changedBy as string | undefined;
    history.createdAt = data.changedAt as Date;

    return history;
  }
}
