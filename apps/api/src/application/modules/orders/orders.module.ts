import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { OrderRepository } from '../../../infrastructure/repositories/order.repository';
import { ProductRepository } from '../../../infrastructure/repositories/product.repository';
import { OrdersController } from '../../../presentation/controllers/orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [PrismaModule],
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
})
export class OrdersModule {}
