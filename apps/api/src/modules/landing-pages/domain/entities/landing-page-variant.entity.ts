import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';
import { SectionConfig } from './landing-page.entity';

export class LandingPageVariant extends BaseEntity {
  @Expose()
  landingPageId!: string;

  @Expose()
  name!: string;

  @Expose()
  trafficWeight!: number;

  @Expose()
  isControl!: boolean;

  @Expose()
  isWinner!: boolean;

  @Expose()
  sections!: SectionConfig[];

  @Expose()
  views!: number;

  @Expose()
  conversions!: number;

  @Expose()
  conversionRate!: number;

  static toDomain(input: unknown): LandingPageVariant | null {
    if (!input || typeof input !== 'object') return null;

    const data = input as Record<string, unknown>;

    const entity = new LandingPageVariant();
    entity.id = typeof data.id === 'string' ? data.id : '';
    entity.landingPageId =
      typeof data.landingPageId === 'string' ? data.landingPageId : '';
    entity.name = typeof data.name === 'string' ? data.name : '';
    entity.trafficWeight =
      typeof data.trafficWeight === 'number' ? data.trafficWeight : 50;
    entity.isControl =
      typeof data.isControl === 'boolean' ? data.isControl : false;
    entity.isWinner =
      typeof data.isWinner === 'boolean' ? data.isWinner : false;
    entity.sections = Array.isArray(data.sections)
      ? (data.sections as SectionConfig[])
      : [];
    entity.views = typeof data.views === 'number' ? data.views : 0;
    entity.conversions =
      typeof data.conversions === 'number' ? data.conversions : 0;
    entity.conversionRate =
      typeof data.conversionRate === 'number' ? data.conversionRate : 0;
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
