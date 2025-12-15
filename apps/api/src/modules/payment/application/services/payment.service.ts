import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrdersService } from '../../../orders/application/services/orders.service';
import { OrderStatus } from '../../../orders/domain/entities/order.entity';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { Money } from '../../domain/value-objects/money.vo';

@Injectable()
export class PaymentService {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async processPayment(
    orderId: string,
    amount: number,
    paymentMethod: PaymentMethod,
  ): Promise<Payment> {
    const orderResponse = await this.ordersService.findOne(orderId);
    if (!orderResponse.data) {
      throw new NotFoundException('Order not found');
    }

    const order = orderResponse.data;
    const paymentAmount = new Money(amount, 'USD');
    const orderAmount = new Money(order.totalAmount, 'USD');

    if (!paymentAmount.equals(orderAmount)) {
      throw new Error(
        `Payment amount ${paymentAmount.toString()} does not match order total ${orderAmount.toString()}`,
      );
    }

    // Create payment entity
    const payment = new Payment();
    payment.orderId = orderId;
    payment.amount = amount;
    payment.currency = 'USD';
    payment.method = paymentMethod;
    payment.status = PaymentStatus.PENDING;

    // Mock payment processing
    const success = await this.mockPaymentGateway(payment);

    if (success) {
      payment.status = PaymentStatus.SUCCESS;
      payment.transactionId = `txn_${Date.now()}`;

      await this.ordersService.updateStatus(orderId, OrderStatus.COMPLETED);
    } else {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Mock payment failed';
    }

    return this.paymentRepository.create(payment);
  }

  private async mockPaymentGateway(payment: Payment): Promise<boolean> {
    console.log(`Processing payment via ${payment.method}:`, payment);
    return true;
  }
}
