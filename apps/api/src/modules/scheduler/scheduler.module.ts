import { PrismaService } from '@/core/prisma/prisma.service';
import { EmailModule } from '@/modules/email/email.module';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentSchedulerService } from './application/services/content-scheduler.service';
import { EmailSchedulerService } from './application/services/email-scheduler.service';
import { SchedulerService } from './application/services/scheduler.service';
import { WebhookService } from './application/services/webhook.service';
import { SchedulerRepository } from './infrastructure/repositories/scheduler.repository';
import { SchedulerController } from './presentation/scheduler.controller';
import { WebhookController } from './presentation/webhook.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    EmailModule,
  ],
  controllers: [SchedulerController, WebhookController],
  providers: [
    PrismaService,
    ContentSchedulerService,
    EmailSchedulerService,
    WebhookService,
    SchedulerService,
    {
      provide: 'ISchedulerRepository',
      useClass: SchedulerRepository,
    },
  ],
  exports: [WebhookService, SchedulerService],
})
export class SchedulerModule {}
