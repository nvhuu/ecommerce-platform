import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { ProductRepository } from '../products/infrastructure/repositories/product.repository';
import { OrdersService } from './application/services/orders.service';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { OrdersController } from './presentation/controllers/orders.controller';

import { CartModule } from '../cart/cart.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule, CartModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: [OrdersService, 'IOrderRepository', 'IProductRepository'],
})
export class OrdersModule {}
