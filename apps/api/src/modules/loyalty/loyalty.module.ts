import { PrismaModule } from '@/core/prisma/prisma.module';
import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { LoyaltyService } from './application/services/loyalty.service';
import { LoyaltyRepository } from './infrastructure/repositories/loyalty.repository';
import { LoyaltyController } from './presentation/loyalty.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [LoyaltyController],
  providers: [
    LoyaltyService,
    {
      provide: 'ILoyaltyRepository',
      useClass: LoyaltyRepository,
    },
  ],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}
