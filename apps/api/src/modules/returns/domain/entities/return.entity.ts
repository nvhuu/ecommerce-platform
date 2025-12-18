import { BaseEntity } from '@/shared/domain/base.entity';
import { ReturnReason, ReturnStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ReturnItem } from './return-item.entity';

export class Return extends BaseEntity {
  @Expose()
  orderId!: string;

  @Expose()
  userId!: string;

  @Expose()
  status!: ReturnStatus;

  @Expose()
  reason!: ReturnReason;

  @Expose()
  note?: string;

  @Expose()
  items?: ReturnItem[];

  @Expose()
  totalRefund!: number;

  @Expose()
  approvedAt?: Date;

  @Expose()
  approvedBy?: string;

  static toDomain(input: unknown): Return | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const ret = new Return();
    ret.id = data.id as string;
    ret.orderId = data.orderId as string;
    ret.userId = data.userId as string;
    ret.status = data.status as ReturnStatus;
    ret.reason = data.reason as ReturnReason;
    ret.note = data.note as string;
    ret.totalRefund = Number(data.totalRefund);
    ret.approvedAt = data.approvedAt
      ? new Date(data.approvedAt as string)
      : undefined;
    ret.approvedBy = data.approvedBy as string;
    ret.createdAt = data.createdAt as Date;
    ret.updatedAt = data.updatedAt as Date;

    if (data.items && Array.isArray(data.items)) {
      ret.items = data.items
        .map((i) => ReturnItem.toDomain(i))
        .filter((i): i is ReturnItem => i !== null);
    }

    return ret;
  }
}
