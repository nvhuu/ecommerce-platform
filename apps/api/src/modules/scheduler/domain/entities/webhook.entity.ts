import { WebhookEvent } from '@prisma/client';
import { Expose } from 'class-transformer';

export class Webhook {
  @Expose()
  id!: string;

  @Expose()
  url!: string;

  @Expose()
  events!: WebhookEvent[];

  @Expose()
  secret!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  failureCount!: number;

  @Expose()
  lastTriggeredAt?: Date | null;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  static toDomain(data: any): Webhook | null {
    if (!data) return null;

    const entity = new Webhook();
    entity.id = data.id;
    entity.url = data.url;
    entity.events = data.events;
    entity.secret = data.secret;
    entity.isActive = data.isActive;
    entity.failureCount = data.failureCount;
    entity.lastTriggeredAt = data.lastTriggeredAt;
    entity.createdAt = data.createdAt;
    entity.updatedAt = data.updatedAt;

    return entity;
  }
}
