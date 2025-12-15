import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from '../../application/services/payment.service';
import { PaymentMethod } from '../../domain/entities/payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('process')
  async createPayment(
    @Body() body: { orderId: string; amount: number; paymentMethod: string },
  ) {
    if (!body.orderId || !body.amount) {
      throw new BadRequestException('Order ID and amount are required');
    }

    return this.paymentService.processPayment(
      body.orderId,
      body.amount,
      body.paymentMethod as PaymentMethod,
    );
  }
}
