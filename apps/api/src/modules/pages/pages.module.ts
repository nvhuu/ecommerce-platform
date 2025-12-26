import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { PagesService } from './application/services/pages.service';
import { IPageRepository } from './domain/repositories/page.repository.interface';
import { PageRepository } from './infrastructure/repositories/page.repository';
import { PagesController } from './presentation/controllers/pages.controller';

@Module({
  imports: [UsersModule],
  controllers: [PagesController],
  providers: [
    PagesService,
    {
      provide: IPageRepository,
      useClass: PageRepository,
    },
  ],
  exports: [PagesService],
})
export class PagesModule {}
