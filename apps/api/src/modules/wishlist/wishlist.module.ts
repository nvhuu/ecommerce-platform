import { Module } from '@nestjs/common';
import { WishlistService } from './application/services/wishlist.service';
import { IWishlistRepository } from './domain/repositories/wishlist.repository.interface';
import { WishlistRepository } from './infrastructure/repositories/wishlist.repository';
import { WishlistController } from './presentation/controllers/wishlist.controller';

@Module({
  controllers: [WishlistController],
  providers: [
    WishlistService,
    {
      provide: IWishlistRepository,
      useClass: WishlistRepository,
    },
  ],
  exports: [WishlistService],
})
export class WishlistModule {}
