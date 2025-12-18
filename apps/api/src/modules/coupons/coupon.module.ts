import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CouponService } from './application/services/coupon.service';
import { CouponRepository } from './infrastructure/repositories/coupon.repository';
import { CouponController } from './presentation/controllers/coupon.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [CouponController],
  providers: [
    CouponService,
    {
      provide: 'ICouponRepository',
      useClass: CouponRepository,
    },
  ],
  exports: [CouponService],
})
export class CouponModule {}
