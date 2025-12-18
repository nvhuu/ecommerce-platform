import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { Payment } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payment: Partial<Payment>): Promise<Payment> {
    const created = await this.prisma.payment.create({
      data: {
        orderId: payment.orderId!,
        amount: payment.amount!,
        currency: payment.currency || 'VND',
        method: payment.method!,
        status: payment.status || 'PENDING',
        gatewayTransactionId: payment.gatewayTransactionId,
        gatewayResponse: payment.gatewayResponse as never,
      },
    });

    const result = Payment.toDomain(created);
    if (!result) throw new Error('Failed to create payment');
    return result;
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    return payment ? Payment.toDomain(payment) : null;
  }

  async findByOrderId(orderId: string): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    return payments
      .map((p) => Payment.toDomain(p))
      .filter((p): p is Payment => p !== null);
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    const updated = await this.prisma.payment.update({
      where: { id },
      data: { status },
    });

    const result = Payment.toDomain(updated);
    if (!result) throw new Error('Failed to update payment');
    return result;
  }

  async processRefund(
    id: string,
    amount: number,
    reason?: string,
  ): Promise<Payment> {
    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        refundedAmount: amount,
        refundedAt: new Date(),
        refundReason: reason,
        status: 'REFUNDED',
      },
    });

    const result = Payment.toDomain(updated);
    if (!result) throw new Error('Failed to process refund');
    return result;
  }
}
