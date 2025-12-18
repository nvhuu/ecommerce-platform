import { PrismaModule } from '@/core/prisma/prisma.module';
import { Global, Module } from '@nestjs/common';
import { NotificationService } from './application/services/notification.service';
import { NotificationRepository } from './infrastructure/repositories/notification.repository';
import { NotificationController } from './presentation/controllers/notification.controller';

@Global() // Global so other modules can inject NotificationService easily
@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
