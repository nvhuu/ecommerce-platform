import { Expose } from 'class-transformer';
import { BaseEntity } from '@/shared/domain/base.entity';

export class IPBlacklist extends BaseEntity {
  @Expose()
  ip!: string;

  @Expose()
  type!: string; // BlockType enum

  @Expose()
  reason?: string;

  @Expose()
  expiresAt?: Date;



  static toDomain(input: unknown): IPBlacklist | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const entity = new IPBlacklist();
    entity.ip = data.ip as string;
    entity.type = data.type as string;
    entity.reason = data.reason as string | undefined;
    entity.expiresAt = data.expiresAt as Date | undefined;
    entity.createdAt = data.createdAt as Date;
    entity.createdBy = data.createdBy as string | undefined;

    return entity;
  }
}
