import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export class ProductView extends BaseEntity {
  @Expose()
  productId!: string;

  @Expose()
  userId?: string;

  @Expose()
  sessionId!: string;

  @Expose()
  userAgent?: string;

  @Expose()
  ipAddress?: string;

  @Expose()
  referrer?: string;

  @Expose()
  viewedAt!: Date;

  static toDomain(input: unknown): ProductView | null {
    if (!input || typeof input !== 'object') return null;

    const data = input as Record<string, unknown>;

    const entity = new ProductView();
    entity.id = typeof data.id === 'string' ? data.id : '';
    entity.productId = typeof data.productId === 'string' ? data.productId : '';
    entity.userId = typeof data.userId === 'string' ? data.userId : undefined;
    entity.sessionId = typeof data.sessionId === 'string' ? data.sessionId : '';
    entity.userAgent =
      typeof data.userAgent === 'string' ? data.userAgent : undefined;
    entity.ipAddress =
      typeof data.ipAddress === 'string' ? data.ipAddress : undefined;
    entity.referrer =
      typeof data.referrer === 'string' ? data.referrer : undefined;
    entity.viewedAt =
      data.viewedAt instanceof Date
        ? data.viewedAt
        : typeof data.viewedAt === 'string'
          ? new Date(data.viewedAt)
          : new Date();
    entity.createdAt =
      data.createdAt instanceof Date
        ? data.createdAt
        : typeof data.createdAt === 'string'
          ? new Date(data.createdAt)
          : new Date();
    entity.updatedAt =
      data.updatedAt instanceof Date
        ? data.updatedAt
        : typeof data.updatedAt === 'string'
          ? new Date(data.updatedAt)
          : new Date();

    return entity;
  }
}
