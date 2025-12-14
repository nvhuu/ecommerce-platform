import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProcessPaymentDto } from '../../application/dtos/payment/process-payment.dto';
import { PaymentService } from '../../application/services/payment.service';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('process')
  @UseGuards(JwtAuthGuard)
  async processPayment(@Body() dto: ProcessPaymentDto) {
    return this.paymentService.processPayment(dto);
  }
}
