import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ShippingAddressService } from './application/services/shipping-address.service';
import { ShippingAddressRepository } from './infrastructure/repositories/shipping-address.repository';
import { ShippingAddressController } from './presentation/controllers/shipping-address.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ShippingAddressController],
  providers: [
    ShippingAddressService,
    {
      provide: 'IShippingAddressRepository',
      useClass: ShippingAddressRepository,
    },
  ],
  exports: [ShippingAddressService],
})
export class ShippingAddressModule {}
