import { Payment } from '../entities/payment.entity';

export interface IPaymentRepository {
  create(payment: Payment): Promise<Payment>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  findById(id: string): Promise<Payment | null>;
  update(id: string, data: Partial<Payment>): Promise<Payment>;
}
