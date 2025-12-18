import { BaseEntity } from '@/shared/domain/base.entity';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class Payment extends BaseEntity {
  @Expose()
  orderId!: string;

  @Expose()
  amount!: number;

  @Expose()
  currency!: string;

  @Expose()
  method!: PaymentMethod;

  @Expose()
  status!: PaymentStatus;

  @Expose()
  gatewayTransactionId?: string;

  @Expose()
  gatewayResponse?: Record<string, unknown>;

  @Expose()
  refundedAmount!: number;

  @Expose()
  refundedAt?: Date;

  @Expose()
  refundReason?: string;

  static toDomain(input: unknown): Payment | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const payment = new Payment();
    payment.id = data.id as string;
    payment.orderId = data.orderId as string;
    payment.amount = Number(data.amount);
    payment.currency = data.currency as string;
    payment.method = data.method as PaymentMethod;
    payment.status = data.status as PaymentStatus;
    payment.gatewayTransactionId = data.gatewayTransactionId as
      | string
      | undefined;
    payment.gatewayResponse = data.gatewayResponse as
      | Record<string, unknown>
      | undefined;
    payment.refundedAmount = Number(data.refundedAmount);
    payment.refundedAt = data.refundedAt as Date | undefined;
    payment.refundReason = data.refundReason as string | undefined;
    payment.createdAt = data.createdAt as Date;
    payment.updatedAt = data.updatedAt as Date;

    return payment;
  }
}
