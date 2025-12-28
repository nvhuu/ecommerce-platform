import { Expose } from 'class-transformer';

import { BaseEntity } from '@/shared/domain/base.entity';

export class EmailTemplate extends BaseEntity {
  @Expose()
  slug!: string;

  @Expose()
  name!: string;

  @Expose()
  subject!: string;

  @Expose()
  content!: string;

  @Expose()
  variables!: string[];

  static toDomain(input: unknown): EmailTemplate | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const entity = new EmailTemplate();
    entity.id = data.id as string;
    entity.slug = data.slug as string;
    entity.name = data.name as string;
    entity.subject = data.subject as string;
    entity.content = data.content as string;
    entity.variables = data.variables as string[];
    entity.createdAt = data.createdAt as Date;
    entity.updatedAt = data.updatedAt as Date;
    return entity;
  }
}
