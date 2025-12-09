import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { ProductRepository } from '../../../infrastructure/repositories/product.repository';
import { ProductsController } from '../../../presentation/controllers/products.controller';
import { ProductsService } from './products.service';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
})
export class ProductsModule {}
