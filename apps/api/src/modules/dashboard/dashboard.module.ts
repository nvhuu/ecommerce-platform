import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { CategoryRepository } from '../categories/infrastructure/repositories/category.repository';
import { OrderRepository } from '../orders/infrastructure/repositories/order.repository';
import { ProductRepository } from '../products/infrastructure/repositories/product.repository';
import { UserRepository } from '../users/infrastructure/repositories/user.repository';
import { DashboardService } from './application/services/dashboard.service';
import { DashboardController } from './presentation/controllers/dashboard.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
  ],
})
export class DashboardModule {}
