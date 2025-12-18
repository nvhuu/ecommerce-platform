import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ProductVariantService } from './application/services/product-variant.service';
import { ProductsService } from './application/services/products.service';
import { ProductVariantRepository } from './infrastructure/repositories/product-variant.repository';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductsController } from './presentation/controllers/products.controller';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductVariantService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'IProductVariantRepository',
      useClass: ProductVariantRepository,
    },
  ],
  exports: [ProductsService, ProductVariantService, 'IProductRepository'],
})
export class ProductsModule {}
