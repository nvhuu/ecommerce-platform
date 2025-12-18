import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export class Notification extends BaseEntity {
  @Expose()
  userId!: string;

  @Expose()
  type!: string;

  @Expose()
  title!: string;

  @Expose()
  message!: string;

  @Expose()
  data?: any;

  @Expose()
  isRead!: boolean;

  static toDomain(input: unknown): Notification | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const entity = new Notification();
    entity.id = data.id as string;
    entity.userId = data.userId as string;
    entity.type = data.type as string;
    entity.title = data.title as string;
    entity.message = data.message as string;
    entity.data = data.data;
    entity.isRead = data.isRead as boolean;
    entity.createdAt = data.createdAt as Date;
    // Notification might not have updatedAt in schema, checking...
    // Schema has createdAt, NO updatedAt. BaseEntity has updatedAt!.
    // We should ignore or mock it.
    entity.updatedAt = new Date(); // Mock or use createdAt

    return entity;
  }
}
