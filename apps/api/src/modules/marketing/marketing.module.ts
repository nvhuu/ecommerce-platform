import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { BannerService } from './application/services/banner.service';
import { PopupService } from './application/services/popup.service';
import { BANNER_REPOSITORY_TOKEN } from './domain/repositories/banner.repository.interface';
import { POPUP_REPOSITORY_TOKEN } from './domain/repositories/popup.repository.interface';
import { BannerRepository } from './infrastructure/repositories/banner.repository';
import { PopupRepository } from './infrastructure/repositories/popup.repository';
import { BannerController } from './presentation/controllers/banner.controller';
import { PopupController } from './presentation/controllers/popup.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [BannerController, PopupController],
  providers: [
    {
      provide: BANNER_REPOSITORY_TOKEN,
      useClass: BannerRepository,
    },
    {
      provide: POPUP_REPOSITORY_TOKEN,
      useClass: PopupRepository,
    },
    BannerService,
    PopupService,
  ],
  exports: [BannerService, PopupService],
})
export class MarketingModule {}
