import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { LandingPageService } from './application/services/landing-page.service';
import { LandingPageAnalyticsRepository } from './infrastructure/repositories/landing-page-analytics.repository';
import { LandingPageVariantRepository } from './infrastructure/repositories/landing-page-variant.repository';
import { LandingPageRepository } from './infrastructure/repositories/landing-page.repository';
import { LandingPagesController } from './presentation/landing-pages.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [LandingPagesController],
  providers: [
    LandingPageService,
    {
      provide: 'ILandingPageRepository',
      useClass: LandingPageRepository,
    },
    {
      provide: 'ILandingPageVariantRepository',
      useClass: LandingPageVariantRepository,
    },
    {
      provide: 'ILandingPageAnalyticsRepository',
      useClass: LandingPageAnalyticsRepository,
    },
  ],
  exports: [LandingPageService],
})
export class LandingPagesModule {}
