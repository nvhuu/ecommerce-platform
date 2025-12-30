import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export enum CheckoutStepType {
  CART_VIEW = 'CART_VIEW',
  SHIPPING_INFO = 'SHIPPING_INFO',
  PAYMENT_INFO = 'PAYMENT_INFO',
  ORDER_REVIEW = 'ORDER_REVIEW',
  ORDER_COMPLETE = 'ORDER_COMPLETE',
}

export class CheckoutStep extends BaseEntity {
  @Expose()
  orderId?: string;

  @Expose()
  userId?: string;

  @Expose()
  sessionId!: string;

  @Expose()
  stepType!: CheckoutStepType;

  @Expose()
  stepData?: Record<string, unknown>;

  @Expose()
  completedAt!: Date;

  static toDomain(input: unknown): CheckoutStep | null {
    if (!input || typeof input !== 'object') return null;

    const data = input as Record<string, unknown>;

    const entity = new CheckoutStep();
    entity.id = typeof data.id === 'string' ? data.id : '';
    entity.orderId =
      typeof data.orderId === 'string' ? data.orderId : undefined;
    entity.userId = typeof data.userId === 'string' ? data.userId : undefined;
    entity.sessionId = typeof data.sessionId === 'string' ? data.sessionId : '';
    entity.stepType =
      typeof data.stepType === 'string' &&
      Object.values(CheckoutStepType).includes(
        data.stepType as CheckoutStepType,
      )
        ? (data.stepType as CheckoutStepType)
        : CheckoutStepType.CART_VIEW;
    entity.stepData =
      data.stepData && typeof data.stepData === 'object'
        ? (data.stepData as Record<string, unknown>)
        : undefined;
    entity.completedAt =
      data.completedAt instanceof Date
        ? data.completedAt
        : typeof data.completedAt === 'string'
          ? new Date(data.completedAt)
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
