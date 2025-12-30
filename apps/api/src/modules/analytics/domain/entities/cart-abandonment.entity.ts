import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export enum AbandonmentStatus {
  ABANDONED = 'ABANDONED',
  RECOVERED = 'RECOVERED',
  EXPIRED = 'EXPIRED',
}

export interface CartItemSnapshot {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export class CartAbandonment extends BaseEntity {
  @Expose()
  userId?: string;

  @Expose()
  sessionId!: string;

  @Expose()
  email?: string;

  @Expose()
  cartItems!: CartItemSnapshot[];

  @Expose()
  cartTotal!: number;

  @Expose()
  status!: AbandonmentStatus;

  @Expose()
  recoveryEmailsSent!: number;

  @Expose()
  lastEmailSentAt?: Date;

  @Expose()
  recoveredAt?: Date;

  @Expose()
  expiredAt?: Date;

  @Expose()
  abandonedAt!: Date;

  static toDomain(input: unknown): CartAbandonment | null {
    if (!input || typeof input !== 'object') return null;

    const data = input as Record<string, unknown>;

    const entity = new CartAbandonment();
    entity.id = typeof data.id === 'string' ? data.id : '';
    entity.userId = typeof data.userId === 'string' ? data.userId : undefined;
    entity.sessionId = typeof data.sessionId === 'string' ? data.sessionId : '';
    entity.email = typeof data.email === 'string' ? data.email : undefined;
    entity.cartItems = Array.isArray(data.cartItems)
      ? (data.cartItems as CartItemSnapshot[])
      : [];
    entity.cartTotal = typeof data.cartTotal === 'number' ? data.cartTotal : 0;
    entity.status =
      typeof data.status === 'string' &&
      Object.values(AbandonmentStatus).includes(
        data.status as AbandonmentStatus,
      )
        ? (data.status as AbandonmentStatus)
        : AbandonmentStatus.ABANDONED;
    entity.recoveryEmailsSent =
      typeof data.recoveryEmailsSent === 'number' ? data.recoveryEmailsSent : 0;
    entity.lastEmailSentAt =
      data.lastEmailSentAt instanceof Date
        ? data.lastEmailSentAt
        : typeof data.lastEmailSentAt === 'string'
          ? new Date(data.lastEmailSentAt)
          : undefined;
    entity.recoveredAt =
      data.recoveredAt instanceof Date
        ? data.recoveredAt
        : typeof data.recoveredAt === 'string'
          ? new Date(data.recoveredAt)
          : undefined;
    entity.expiredAt =
      data.expiredAt instanceof Date
        ? data.expiredAt
        : typeof data.expiredAt === 'string'
          ? new Date(data.expiredAt)
          : undefined;
    entity.abandonedAt =
      data.abandonedAt instanceof Date
        ? data.abandonedAt
        : typeof data.abandonedAt === 'string'
          ? new Date(data.abandonedAt)
          : new Date();
    entity.createdAt =
      data.createdAt instanceof Date
        ? data.createdAt
        : typeof data.createdAt === 'string'
          ? new Date(data.createdAt)
          : new Date();
    entity.updatedAt =
      data.updatedAt instanceof Date
        ? data.updatedAt
        : typeof data.updatedAt === 'string'
          ? new Date(data.updatedAt)
          : new Date();

    return entity;
  }
}
