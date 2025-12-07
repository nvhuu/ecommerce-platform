import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { CategoryRepository } from '../../../infrastructure/repositories/category.repository';
import { OrderRepository } from '../../../infrastructure/repositories/order.repository';
import { ProductRepository } from '../../../infrastructure/repositories/product.repository';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { DashboardController } from '../../../presentation/controllers/dashboard.controller';
import { DashboardService } from './dashboard.service';

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
