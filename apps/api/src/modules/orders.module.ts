import { Module } from '@nestjs/common';
import { OrdersService } from '../application/services/orders.service';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { ProductRepository } from '../infrastructure/repositories/product.repository';
import { OrdersController } from '../presentation/controllers/orders.controller';

import { CartModule } from './cart.module';
import { UsersModule } from './users.module';

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
