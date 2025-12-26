import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { SettingsService } from './application/services/settings.service';
import { ISettingRepository } from './domain/repositories/setting.repository.interface';
import { SettingRepository } from './infrastructure/repositories/setting.repository';
import { SettingsController } from './presentation/controllers/settings.controller';

@Module({
  imports: [UsersModule],
  controllers: [SettingsController],
  providers: [
    SettingsService,
    {
      provide: ISettingRepository,
      useClass: SettingRepository,
    },
  ],
  exports: [SettingsService],
})
export class SettingsModule {}
