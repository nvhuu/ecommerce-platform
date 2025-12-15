import { MESSAGES } from '@/shared/constants/messages.constant';
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
  ) {
    const orderResponse = await this.ordersService.findOne(orderId);
    if (!orderResponse.data) {
      throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    }

    const order = orderResponse.data;
    const paymentAmount = new Money(amount, 'USD');
    const orderAmount = new Money(order.totalAmount, 'USD');

    if (!paymentAmount.equals(orderAmount)) {
      throw new Error(MESSAGES.PAYMENT.AMOUNT_MISMATCH);
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

    const created = await this.paymentRepository.create(payment);

    return {
      message: success ? MESSAGES.PAYMENT.PROCESSED : MESSAGES.PAYMENT.FAILED,
      data: created,
    };
  }

  private async mockPaymentGateway(payment: Payment): Promise<boolean> {
    console.log(`Processing payment via ${payment.method}:`, payment);
    return true;
  }
}
