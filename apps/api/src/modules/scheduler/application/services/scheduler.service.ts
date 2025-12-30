import { MESSAGES } from '@/shared/constants/messages.constant';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ScheduleStatus } from '@prisma/client';
import { CronJob as CronJobLib } from 'cron';
import { ISchedulerRepository } from '../../domain/repositories/scheduler.repository.interface';
import { ContentSchedulerService } from './content-scheduler.service';
import { EmailSchedulerService } from './email-scheduler.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @Inject('ISchedulerRepository')
    private readonly schedulerRepository: ISchedulerRepository,
    private readonly contentScheduler: ContentSchedulerService,
    private readonly emailScheduler: EmailSchedulerService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    await this.loadDynamicCronJobs();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledTasks() {
    this.logger.debug('Checking for scheduled tasks...');

    // 1. Process Content
    await this.processContent();

    // 2. Process Emails
    await this.emailScheduler.processDueEmails();
  }

  private async processContent() {
    const dueContent = await this.schedulerRepository.findDueContent();
    if (dueContent.length === 0) return;

    this.logger.log(`Processing ${dueContent.length} content items`);

    for (const item of dueContent) {
      try {
        if (item.action === 'PUBLISH') {
          await this.contentScheduler.publish(item.contentType, item.contentId);
        } else if (item.action === 'UNPUBLISH') {
          await this.contentScheduler.unpublish(
            item.contentType,
            item.contentId,
          );
        }

        await this.schedulerRepository.updateScheduledContent(item.id, {
          status: ScheduleStatus.PROCESSED,
          processedAt: new Date(),
        });
      } catch (error) {
        this.logger.error(`Failed to process content ${item.id}`, error);
        await this.schedulerRepository.updateScheduledContent(item.id, {
          status: ScheduleStatus.FAILED,
          error:
            error instanceof Error
              ? error.message
              : MESSAGES.SCHEDULER.UNKNOWN_ERROR,
        });
      }
    }
  }

  // ==========================================
  // Dynamic Cron Jobs Management
  // ==========================================

  async loadDynamicCronJobs() {
    const jobs = await this.schedulerRepository.findAllCronJobs();
    this.logger.log(`Loading ${jobs.length} dynamic cron jobs`);

    for (const job of jobs) {
      if (job.isEnabled) {
        this.addCronJob(job.name, job.schedule);
      }
    }
  }

  addCronJob(name: string, cronExpression: string) {
    const job = new CronJobLib(cronExpression, () => {
      this.logger.warn(`Dynamic Cron Job '${name}' triggered!`);
      // Logic for dynamic jobs (e.g., calling a webhook or specific service) requires
      // mapping 'name' to actual handler. For now, we just log.
      // In future: SchedulerService could dispatch an event with the job name.
      this.updateLastRun(name);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.log(`Added cron job ${name} at ${cronExpression}`);
  }

  deleteCronJob(name: string) {
    if (this.schedulerRegistry.doesExist('cron', name)) {
      this.schedulerRegistry.deleteCronJob(name);
      this.logger.log(`Deleted cron job ${name}`);
    }
  }

  private async updateLastRun(name: string) {
    const jobEntity = await this.schedulerRepository.findCronJobByName(name);
    if (jobEntity) {
      await this.schedulerRepository.updateCronJob(jobEntity.id, {
        lastRunAt: new Date(),
        // Calculate next run if possible, or leave it for now
      });
    }
  }
}
