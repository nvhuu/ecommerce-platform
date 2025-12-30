import { Expose } from 'class-transformer';

export class LandingPageAnalytics {
  @Expose()
  id!: string;

  @Expose()
  landingPageId!: string;

  @Expose()
  variantId?: string;

  @Expose()
  eventType!: string;

  @Expose()
  sectionType?: string;

  @Expose()
  conversionGoal?: string;

  @Expose()
  userId?: string;

  @Expose()
  sessionId?: string;

  @Expose()
  ip?: string;

  @Expose()
  userAgent?: string;

  @Expose()
  metadata?: Record<string, unknown>;

  @Expose()
  createdAt!: Date;

  static toDomain(input: unknown): LandingPageAnalytics | null {
    if (!input || typeof input !== 'object') return null;

    const data = input as Record<string, unknown>;

    const entity = new LandingPageAnalytics();
    entity.id = typeof data.id === 'string' ? data.id : '';
    entity.landingPageId =
      typeof data.landingPageId === 'string' ? data.landingPageId : '';
    entity.variantId =
      typeof data.variantId === 'string' ? data.variantId : undefined;
    entity.eventType = typeof data.eventType === 'string' ? data.eventType : '';
    entity.sectionType =
      typeof data.sectionType === 'string' ? data.sectionType : undefined;
    entity.conversionGoal =
      typeof data.conversionGoal === 'string' ? data.conversionGoal : undefined;
    entity.userId = typeof data.userId === 'string' ? data.userId : undefined;
    entity.sessionId =
      typeof data.sessionId === 'string' ? data.sessionId : undefined;
    entity.ip = typeof data.ip === 'string' ? data.ip : undefined;
    entity.userAgent =
      typeof data.userAgent === 'string' ? data.userAgent : undefined;
    entity.metadata =
      data.metadata && typeof data.metadata === 'object'
        ? (data.metadata as Record<string, unknown>)
        : undefined;
    entity.createdAt =
      data.createdAt instanceof Date
        ? data.createdAt
        : typeof data.createdAt === 'string'
          ? new Date(data.createdAt)
          : new Date();

    return entity;
  }
}
