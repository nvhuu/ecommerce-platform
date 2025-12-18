import { PaymentStatus } from '@prisma/client';
import { Payment } from '../entities/payment.entity';

export interface IPaymentRepository {
  create(payment: Partial<Payment>): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment[]>;
  updateStatus(id: string, status: PaymentStatus): Promise<Payment>;
  processRefund(id: string, amount: number, reason?: string): Promise<Payment>;
}
