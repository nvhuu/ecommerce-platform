import { Module } from '@nestjs/common';
import { PaymentService } from '../application/services/payment.service';
import { PaymentController } from '../presentation/controllers/payment.controller'; // Fixed path? Wait, previous was ../controllers
// The PaymentModule file was moved to src/modules.
// PaymentController is in src/presentation/controllers. So ../presentation/controllers is correct.
import { OrdersModule } from './orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
