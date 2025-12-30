import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AnalyticsService } from './application/services/analytics.service';
import { CartRecoveryService } from './application/services/cart-recovery.service';
import { AnalyticsRepository } from './infrastructure/repositories/analytics.repository';
import { AnalyticsController } from './presentation/analytics.controller';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [AnalyticsController],
  providers: [
    {
      provide: 'IAnalyticsRepository',
      useClass: AnalyticsRepository,
    },
    AnalyticsService,
    CartRecoveryService,
  ],
  exports: [AnalyticsService, CartRecoveryService],
})
export class AnalyticsModule {}
