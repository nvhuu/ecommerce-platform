import { Module } from '@nestjs/common';
import { CartService } from '../application/services/cart.service';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { CartController } from '../presentation/controllers/cart.controller';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService],
  exports: [CartService],
})
export class CartModule {}
