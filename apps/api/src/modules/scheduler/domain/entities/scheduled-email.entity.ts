import { ScheduleStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ScheduledEmail {
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
  error?: string | null;

  @Expose()
  createdAt!: Date;

  @Expose()
  processedAt?: Date | null;

  static toDomain(data: any): ScheduledEmail | null {
    if (!data) return null;

    const entity = new ScheduledEmail();
    entity.id = data.id;
    entity.templateKey = data.templateKey;
    entity.recipients = data.recipients;
    entity.data = data.data;
    entity.scheduleAt = data.scheduleAt;
    entity.status = data.status;
    entity.error = data.error;
    entity.createdAt = data.createdAt;
    entity.processedAt = data.processedAt;

    return entity;
  }
}
