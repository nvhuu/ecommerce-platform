import { WebhookEvent } from '@prisma/client';
import { CronJob } from '../entities/cron-job.entity';
import { ScheduledContent } from '../entities/scheduled-content.entity';
import { ScheduledEmail } from '../entities/scheduled-email.entity';
import { Webhook } from '../entities/webhook.entity';

export interface ISchedulerRepository {
  // Scheduled Content
  createScheduledContent(
    data: Partial<ScheduledContent>,
  ): Promise<ScheduledContent>;
  findDueContent(): Promise<ScheduledContent[]>;
  updateScheduledContent(
    id: string,
    data: Partial<ScheduledContent>,
  ): Promise<ScheduledContent>;

  // Scheduled Email
  createScheduledEmail(data: Partial<ScheduledEmail>): Promise<ScheduledEmail>;
  findDueEmails(): Promise<ScheduledEmail[]>;
  updateScheduledEmail(
    id: string,
    data: Partial<ScheduledEmail>,
  ): Promise<ScheduledEmail>;

  // Cron Jobs
  createCronJob(data: Partial<CronJob>): Promise<CronJob>;
  findAllCronJobs(): Promise<CronJob[]>;
  findCronJobByName(name: string): Promise<CronJob | null>;
  updateCronJob(id: string, data: Partial<CronJob>): Promise<CronJob>;

  // Webhooks
  createWebhook(data: Partial<Webhook>): Promise<Webhook>;
  findAllWebhooks(): Promise<Webhook[]>;
  findWebhooksByEvent(event: WebhookEvent): Promise<Webhook[]>;
  updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook>;
  deleteWebhook(id: string): Promise<void>;
}
