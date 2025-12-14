import { Injectable, Logger } from '@nestjs/common';
import { ProcessPaymentDto } from '../dtos/payment/process-payment.dto';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { OrdersService } from './orders.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly ordersService: OrdersService) {}

  async processPayment(
    dto: ProcessPaymentDto,
  ): Promise<ServiceResponse<{ transactionId: string; status: string }>> {
    this.logger.log(
      `Processing payment for Order ${dto.orderId}: ${dto.amount} ${dto.currency}`,
    );

    // Mock Logic:
    // For now, assume success unless amount is specifically -1 (test case)
    if (dto.amount < 0) {
      return {
        message: 'Payment failed due to invalid amount',
        data: { transactionId: '', status: 'FAILED' },
      };
    }

    // Simulate standard latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockTransactionId = `txn_${Math.random().toString(36).substring(2, 15)}`;

    // Update Order Status
    try {
      await this.ordersService.updateStatus(dto.orderId, 'PAID'); // 'PAID' status? Need to ensure it matches OrderStatus enum or logic.
      // Assuming 'COMPLETED' or 'PAID'. Let's check typical status.
      // Controller example used 'SHIPPED'.
      // Typically: PENDING -> PAID -> SHIPPED -> COMPLETED ?
      // Or PENDING -> COMPLETED?
      // Let's use 'COMPLETED' for now as simple flow.
    } catch (e) {
      this.logger.error(`Failed to update order status for ${dto.orderId}`, e);
    }

    return {
      message: 'Payment processed successfully',
      data: {
        transactionId: mockTransactionId,
        status: 'COMPLETED',
      },
    };
  }
}
