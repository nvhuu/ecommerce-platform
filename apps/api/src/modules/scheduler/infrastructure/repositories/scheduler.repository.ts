import { PrismaService } from '@/core/prisma/prisma.service';
import { MESSAGES } from '@/shared/constants/messages.constant';
import { Injectable } from '@nestjs/common';
import { ScheduleStatus, WebhookEvent } from '@prisma/client';
import { CronJob } from '../../domain/entities/cron-job.entity';
import { ScheduledContent } from '../../domain/entities/scheduled-content.entity';
import { ScheduledEmail } from '../../domain/entities/scheduled-email.entity';
import { Webhook } from '../../domain/entities/webhook.entity';
import { ISchedulerRepository } from '../../domain/repositories/scheduler.repository.interface';

@Injectable()
export class SchedulerRepository implements ISchedulerRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // Scheduled Content
  // ==========================================

  async createScheduledContent(
    data: Partial<ScheduledContent>,
  ): Promise<ScheduledContent> {
    const created = await this.prisma.scheduledContent.create({
      data: {
        contentType: data.contentType!,
        contentId: data.contentId!,
        action: data.action!,
        scheduleAt: data.scheduleAt!,
        status: data.status || ScheduleStatus.PENDING,
        error: data.error,
        processedAt: data.processedAt,
      },
    });

    const domain = ScheduledContent.toDomain(created);
    if (!domain) throw new Error(MESSAGES.SCHEDULER.DOMAIN_CONVERSION_FAILED);
    return domain;
  }

  async findDueContent(): Promise<ScheduledContent[]> {
    const contents = await this.prisma.scheduledContent.findMany({
      where: {
        status: ScheduleStatus.PENDING,
        scheduleAt: { lte: new Date() },
      },
      orderBy: { scheduleAt: 'asc' },
    });

    return contents
      .map((c) => ScheduledContent.toDomain(c))
      .filter((c): c is ScheduledContent => c !== null);
  }

  async updateScheduledContent(
    id: string,
    data: Partial<ScheduledContent>,
  ): Promise<ScheduledContent> {
    const updated = await this.prisma.scheduledContent.update({
      where: { id },
      data: {
        status: data.status,
        error: data.error,
        processedAt: data.processedAt,
      },
    });

    const domain = ScheduledContent.toDomain(updated);
    if (!domain) throw new Error(MESSAGES.SCHEDULER.DOMAIN_CONVERSION_FAILED);
    return domain;
  }

  // ==========================================
  // Scheduled Email
  // ==========================================

  async createScheduledEmail(
    data: Partial<ScheduledEmail>,
  ): Promise<ScheduledEmail> {
    const created = await this.prisma.scheduledEmail.create({
      data: {
        templateKey: data.templateKey!,
        recipients: data.recipients!,
        data: data.data ? JSON.parse(JSON.stringify(data.data)) : null,
        scheduleAt: data.scheduleAt!,
        status: data.status || ScheduleStatus.PENDING,
        error: data.error,
        processedAt: data.processedAt,
      },
    });

    const domain = ScheduledEmail.toDomain(created);
    if (!domain) throw new Error(MESSAGES.SCHEDULER.DOMAIN_CONVERSION_FAILED);
    return domain;
  }

  async findDueEmails(): Promise<ScheduledEmail[]> {
    const emails = await this.prisma.scheduledEmail.findMany({
      where: {
        status: ScheduleStatus.PENDING,
        scheduleAt: { lte: new Date() },
      },
      orderBy: { scheduleAt: 'asc' },
    });

    return emails
      .map((e) => ScheduledEmail.toDomain(e))
      .filter((e): e is ScheduledEmail => e !== null);
  }

  async updateScheduledEmail(
    id: string,
    data: Partial<ScheduledEmail>,
  ): Promise<ScheduledEmail> {
    const updated = await this.prisma.scheduledEmail.update({
      where: { id },
      data: {
        status: data.status,
        error: data.error,
        processedAt: data.processedAt,
      },
    });

    const domain = ScheduledEmail.toDomain(updated);
    if (!domain) throw new Error(MESSAGES.SCHEDULER.DOMAIN_CONVERSION_FAILED);
    return domain;
  }

  // ==========================================
  // Cron Jobs
  // ==========================================

  async createCronJob(data: Partial<CronJob>): Promise<CronJob> {
    const created = await this.prisma.cronJob.create({
      data: {
        name: data.name!,
        schedule: data.schedule!,
        isEnabled: data.isEnabled ?? true,
        lastRunAt: data.lastRunAt,
        nextRunAt: data.nextRunAt,
      },
    });

    const domain = CronJob.toDomain(created);
    if (!domain) throw new Error(MESSAGES.SCHEDULER.DOMAIN_CONVERSION_FAILED);
    return domain;
  }

  async findAllCronJobs(): Promise<CronJob[]> {
    const jobs = await this.prisma.cronJob.findMany();
    return jobs
      .map((j) => CronJob.toDomain(j))
      .filter((j): j is CronJob => j !== null);
  }

  async findCronJobByName(name: string): Promise<CronJob | null> {
    const job = await this.prisma.cronJob.findUnique({
      where: { name },
    });
    return CronJob.toDomain(job);
  }

  async updateCronJob(id: string, data: Partial<CronJob>): Promise<CronJob> {
    const updated = await this.prisma.cronJob.update({
      where: { id },
      data: {
        schedule: data.schedule,
        isEnabled: data.isEnabled,
        lastRunAt: data.lastRunAt,
        nextRunAt: data.nextRunAt,
      },
    });

    const domain = CronJob.toDomain(updated);
    if (!domain) throw new Error(MESSAGES.SCHEDULER.DOMAIN_CONVERSION_FAILED);
    return domain;
  }

  // ==========================================
  // Webhooks
  // ==========================================

  async createWebhook(data: Partial<Webhook>): Promise<Webhook> {
    const created = await this.prisma.webhook.create({
      data: {
        url: data.url!,
        events: data.events!,
        secret: data.secret!,
        isActive: data.isActive ?? true,
        lastTriggeredAt: data.lastTriggeredAt,
        failureCount: data.failureCount || 0,
      },
    });

    const domain = Webhook.toDomain(created);
    if (!domain) throw new Error(MESSAGES.SCHEDULER.DOMAIN_CONVERSION_FAILED);
    return domain;
  }

  async findAllWebhooks(): Promise<Webhook[]> {
    const webhooks = await this.prisma.webhook.findMany();
    return webhooks
      .map((w) => Webhook.toDomain(w))
      .filter((w): w is Webhook => w !== null);
  }

  async findWebhooksByEvent(event: WebhookEvent): Promise<Webhook[]> {
    const webhooks = await this.prisma.webhook.findMany({
      where: {
        events: { has: event },
        isActive: true,
      },
    });

    return webhooks
      .map((w) => Webhook.toDomain(w))
      .filter((w): w is Webhook => w !== null);
  }

  async updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook> {
    const updated = await this.prisma.webhook.update({
      where: { id },
      data: {
        url: data.url,
        events: data.events,
        secret: data.secret,
        isActive: data.isActive,
        lastTriggeredAt: data.lastTriggeredAt,
        failureCount: data.failureCount,
      },
    });

    const domain = Webhook.toDomain(updated);
    if (!domain) throw new Error(MESSAGES.SCHEDULER.DOMAIN_CONVERSION_FAILED);
    return domain;
  }

  async deleteWebhook(id: string): Promise<void> {
    await this.prisma.webhook.delete({ where: { id } });
  }
}
