import { Expose } from 'class-transformer';

export enum EmailStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
}

import { BaseEntity } from '@/shared/domain/base.entity';

export class EmailLog extends BaseEntity {
  @Expose()
  userId?: string;

  @Expose()
  recipient!: string;

  @Expose()
  subject!: string;

  @Expose()
  template?: string;

  @Expose()
  metadata?: Record<string, unknown>;

  @Expose()
  status!: EmailStatus;

  @Expose()
  provider!: string;

  @Expose()
  error?: string;

  @Expose()
  messageId?: string;

  @Expose()
  sentAt?: Date;

  static toDomain(input: unknown): EmailLog | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const entity = new EmailLog();
    entity.id = data.id as string;
    entity.userId = data.userId as string | undefined;
    entity.recipient = data.recipient as string;
    entity.subject = data.subject as string;
    entity.template = data.template as string | undefined;
    entity.metadata = data.metadata as Record<string, unknown> | undefined;
    entity.status = data.status as EmailStatus;
    entity.provider = data.provider as string;
    entity.error = data.error as string | undefined;
    entity.messageId = data.messageId as string | undefined;
    entity.sentAt = data.sentAt as Date | undefined;
    entity.createdAt = data.createdAt as Date;
    entity.updatedAt = data.updatedAt as Date;
    return entity;
  }
}
