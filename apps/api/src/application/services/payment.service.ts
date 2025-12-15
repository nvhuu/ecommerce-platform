import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../../domain/entities/order.entity';
import { OrdersService } from './orders.service';

@Injectable()
export class PaymentService {
  constructor(private readonly ordersService: OrdersService) {}

  async processPayment(
    orderId: string,
    amount: number,
    paymentMethod: string,
  ): Promise<boolean> {
    console.log(
      `Processing payment for order ${orderId} amount ${amount} via ${paymentMethod}`,
    );

    // Validate order exists
    const orderResponse = await this.ordersService.findOne(orderId);
    if (!orderResponse.data) {
      throw new NotFoundException('Order not found');
    }

    const order = orderResponse.data;

    // Check if amount matches
    if (order.totalAmount !== amount) {
      // In a real app we might handle partial payments or currency conversion
      console.warn(
        `Payment amount ${amount} does not match order total ${order.totalAmount}`,
      );
    }

    // Mock payment logic
    // Simulate API call to payment provider
    const success = true;

    if (success) {
      await this.ordersService.updateStatus(orderId, OrderStatus.COMPLETED);
    }
    return success;
  }
}
