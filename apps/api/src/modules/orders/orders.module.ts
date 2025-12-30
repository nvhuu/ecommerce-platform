import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { OrderHistoryService } from './application/services/order-history.service';
import { OrderNoteService } from './application/services/order-note.service';
import { OrdersService } from './application/services/orders.service';
import { OrderHistoryRepository } from './infrastructure/repositories/order-history.repository';
import { OrderNoteRepository } from './infrastructure/repositories/order-note.repository';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { OrdersController } from './presentation/controllers/orders.controller';

@Module({
  imports: [PrismaModule, ProductsModule, UsersModule, LoyaltyModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderHistoryService,
    OrderNoteService,
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    {
      provide: 'IOrderHistoryRepository',
      useClass: OrderHistoryRepository,
    },
    {
      provide: 'IOrderNoteRepository',
      useClass: OrderNoteRepository,
    },
  ],
  exports: [OrdersService, OrderHistoryService, 'IOrderRepository'],
})
export class OrdersModule {}
