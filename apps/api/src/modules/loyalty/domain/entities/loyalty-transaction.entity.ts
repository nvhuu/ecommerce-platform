import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export enum LoyaltyTransactionType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  EXPIRE = 'EXPIRE',
  ADJUST = 'ADJUST',
}

export class LoyaltyTransaction extends BaseEntity {
  @Expose()
  userId!: string;

  @Expose()
  type!: LoyaltyTransactionType;

  @Expose()
  points!: number;

  @Expose()
  description!: string;

  @Expose()
  orderId?: string;

  @Expose()
  metadata?: Record<string, unknown>;

  static toDomain(input: unknown): LoyaltyTransaction | null {
    if (!input || typeof input !== 'object') return null;

    const data = input as Record<string, unknown>;
    const transaction = new LoyaltyTransaction();

    transaction.id = data.id as string;
    transaction.userId = data.userId as string;
    transaction.type = data.type as LoyaltyTransactionType;
    transaction.points = Number(data.points);
    transaction.description = data.description as string;
    transaction.orderId = data.orderId ? (data.orderId as string) : undefined;
    transaction.metadata = data.metadata
      ? (data.metadata as Record<string, unknown>)
      : undefined;

    transaction.createdAt = data.createdAt as Date;
    transaction.createdBy = data.createdBy
      ? (data.createdBy as string)
      : undefined;

    return transaction;
  }
}
