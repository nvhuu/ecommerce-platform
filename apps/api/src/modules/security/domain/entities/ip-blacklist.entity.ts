import { Expose } from 'class-transformer';

export class IPBlacklist {
  @Expose()
  ip!: string;

  @Expose()
  type!: string; // BlockType enum

  @Expose()
  reason?: string;

  @Expose()
  expiresAt?: Date;

  @Expose()
  createdAt!: Date;

  @Expose()
  createdBy?: string;

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
