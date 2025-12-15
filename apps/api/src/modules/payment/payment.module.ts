import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { PaymentService } from './application/services/payment.service';
import { PaymentRepository } from './infrastructure/repositories/payment.repository';
import { PaymentController } from './presentation/controllers/payment.controller';

@Module({
  imports: [PrismaModule, OrdersModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepository,
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
