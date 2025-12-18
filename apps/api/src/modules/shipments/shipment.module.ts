import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ShipmentService } from './application/services/shipment.service';
import { ShipmentRepository } from './infrastructure/repositories/shipment.repository';
import { ShipmentController } from './presentation/controllers/shipment.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ShipmentController],
  providers: [
    ShipmentService,
    {
      provide: 'IShipmentRepository',
      useClass: ShipmentRepository,
    },
  ],
  exports: [ShipmentService],
})
export class ShipmentModule {}
