import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { InventoryService } from './application/services/inventory.service';
import { InventoryTransactionRepository } from './infrastructure/repositories/inventory-transaction.repository';
import { InventoryController } from './presentation/controllers/inventory.controller';

@Module({
  imports: [PrismaModule, ProductsModule, UsersModule],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    {
      provide: 'IInventoryTransactionRepository',
      useClass: InventoryTransactionRepository,
    },
  ],
  exports: [InventoryService],
})
export class InventoryModule {}
