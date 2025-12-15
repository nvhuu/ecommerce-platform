import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MediaService } from './application/services/media.service';
import { MediaRepository } from './infrastructure/repositories/media.repository';
import { StorageModule } from './infrastructure/storage/storage.module';
import { MediaController } from './presentation/controllers/media.controller';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    {
      provide: 'IMediaRepository',
      useClass: MediaRepository,
    },
  ],
  exports: [MediaService],
})
export class MediaModule {}
