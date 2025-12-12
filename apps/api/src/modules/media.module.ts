import { Module } from '@nestjs/common';
import 'multer';
import { MediaService } from '../application/services/media.service';
import { StorageModule } from '../infrastructure/storage/storage.module';
import { MediaController } from '../presentation/controllers/media.controller';

@Module({
  imports: [StorageModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
