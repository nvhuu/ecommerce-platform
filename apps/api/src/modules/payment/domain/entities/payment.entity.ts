import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

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
  transactionId?: string;

  @Expose()
  failureReason?: string;

  static toDomain(data: unknown): Payment | null {
    if (!data || typeof data !== 'object') return null;

    const record = data as Record<string, unknown>;
    const payment = new Payment();

    payment.id = record.id as string;
    payment.orderId = record.orderId as string;
    payment.amount = record.amount as number;
    payment.currency = (record.currency as string) || 'USD';
    payment.method = record.method as PaymentMethod;
    payment.status = record.status as PaymentStatus;
    payment.transactionId = record.transactionId as string | undefined;
    payment.failureReason = record.failureReason as string | undefined;
    payment.createdAt = record.createdAt as Date;
    payment.updatedAt = (record.updatedAt as Date) || undefined;

    return payment;
  }
}
