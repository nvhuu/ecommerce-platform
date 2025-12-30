import { ContentType, ScheduleStatus, WebhookEvent } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ScheduledContentDto {
  @Expose()
  id!: string;

  @Expose()
  contentType!: ContentType;

  @Expose()
  contentId!: string;

  @Expose()
  action!: string;

  @Expose()
  scheduleAt!: Date;

  @Expose()
  status!: ScheduleStatus;

  @Expose()
  error?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  processedAt?: Date;
}

export class ScheduledEmailDto {
  @Expose()
  id!: string;

  @Expose()
  templateKey!: string;

  @Expose()
  recipients!: string[];

  @Expose()
  data?: any;

  @Expose()
  scheduleAt!: Date;

  @Expose()
  status!: ScheduleStatus;

  @Expose()
  error?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  processedAt?: Date;
}

export class CronJobDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  schedule!: string;

  @Expose()
  isEnabled!: boolean;

  @Expose()
  lastRunAt?: Date;

  @Expose()
  nextRunAt?: Date;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export class WebhookDto {
  @Expose()
  id!: string;

  @Expose()
  url!: string;

  @Expose()
  events!: WebhookEvent[];

  @Expose()
  isActive!: boolean;

  @Expose()
  failureCount!: number;

  @Expose()
  lastTriggeredAt?: Date;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
