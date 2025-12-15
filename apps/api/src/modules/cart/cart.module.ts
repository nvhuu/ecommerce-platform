import { Module } from '@nestjs/common';
import { CartService } from './application/services/cart.service';
import { CartRepository } from './infrastructure/repositories/cart.repository';
import { CartController } from './presentation/controllers/cart.controller';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: 'ICartRepository',
      useClass: CartRepository,
    },
  ],
  exports: [CartService],
})
export class CartModule {}
