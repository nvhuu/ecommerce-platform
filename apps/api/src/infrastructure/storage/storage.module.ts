import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LocalStorageService } from './local-storage.service';
import { StorageService } from './storage.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: StorageService,
      useClass: LocalStorageService,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
