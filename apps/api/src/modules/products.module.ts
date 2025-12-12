import { Module } from '@nestjs/common';
import { ProductsService } from '../application/services/products.service';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { ProductRepository } from '../infrastructure/repositories/product.repository';
import { ProductsController } from '../presentation/controllers/products.controller';

import { UsersModule } from './users.module';

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
