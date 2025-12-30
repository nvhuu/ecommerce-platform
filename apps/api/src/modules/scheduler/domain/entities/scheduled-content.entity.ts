import { ContentType, ScheduleStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ScheduledContent {
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
  error?: string | null;

  @Expose()
  createdAt!: Date;

  @Expose()
  processedAt?: Date | null;

  static toDomain(data: any): ScheduledContent | null {
    if (!data) return null;

    const entity = new ScheduledContent();
    entity.id = data.id;
    entity.contentType = data.contentType;
    entity.contentId = data.contentId;
    entity.action = data.action;
    entity.scheduleAt = data.scheduleAt;
    entity.status = data.status;
    entity.error = data.error;
    entity.createdAt = data.createdAt;
    entity.processedAt = data.processedAt;

    return entity;
  }
}
