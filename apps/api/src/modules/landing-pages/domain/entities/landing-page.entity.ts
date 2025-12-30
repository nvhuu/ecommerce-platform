import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export enum LandingPageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum SectionType {
  HERO = 'HERO',
  FEATURES = 'FEATURES',
  TESTIMONIALS = 'TESTIMONIALS',
  CTA = 'CTA',
  FAQ = 'FAQ',
  PRICING = 'PRICING',
  GALLERY = 'GALLERY',
  CONTACT = 'CONTACT',
}

export enum ConversionGoalType {
  FORM_SUBMISSION = 'FORM_SUBMISSION',
  BUTTON_CLICK = 'BUTTON_CLICK',
  PAGE_VIEW = 'PAGE_VIEW',
  SCROLL_DEPTH = 'SCROLL_DEPTH',
  TIME_ON_PAGE = 'TIME_ON_PAGE',
}

export interface SectionConfig {
  type: SectionType;
  order: number;
  config: Record<string, unknown>;
}

export interface ConversionGoal {
  type: ConversionGoalType;
  value: string;
}

export class LandingPage extends BaseEntity {
  @Expose()
  name!: string;

  @Expose()
  slug!: string;

  @Expose()
  description?: string;

  @Expose()
  status!: LandingPageStatus;

  @Expose()
  seoTitle?: string;

  @Expose()
  seoDescription?: string;

  @Expose()
  seoKeywords?: string[];

  @Expose()
  sections!: SectionConfig[];

  @Expose()
  isAbTest!: boolean;

  @Expose()
  views!: number;

  @Expose()
  conversions!: number;

  @Expose()
  conversionGoals?: ConversionGoal[];

  @Expose()
  publishedAt?: Date;

  static toDomain(input: unknown): LandingPage | null {
    if (!input || typeof input !== 'object') return null;

    const data = input as Record<string, unknown>;

    const entity = new LandingPage();
    entity.id = typeof data.id === 'string' ? data.id : '';
    entity.name = typeof data.name === 'string' ? data.name : '';
    entity.slug = typeof data.slug === 'string' ? data.slug : '';
    entity.description =
      typeof data.description === 'string' ? data.description : undefined;
    entity.status =
      typeof data.status === 'string' &&
      Object.values(LandingPageStatus).includes(
        data.status as LandingPageStatus,
      )
        ? (data.status as LandingPageStatus)
        : LandingPageStatus.DRAFT;
    entity.seoTitle =
      typeof data.seoTitle === 'string' ? data.seoTitle : undefined;
    entity.seoDescription =
      typeof data.seoDescription === 'string' ? data.seoDescription : undefined;
    entity.seoKeywords = Array.isArray(data.seoKeywords)
      ? data.seoKeywords.filter((k): k is string => typeof k === 'string')
      : undefined;
    entity.sections = Array.isArray(data.sections)
      ? (data.sections as SectionConfig[])
      : [];
    entity.isAbTest =
      typeof data.isAbTest === 'boolean' ? data.isAbTest : false;
    entity.views = typeof data.views === 'number' ? data.views : 0;
    entity.conversions =
      typeof data.conversions === 'number' ? data.conversions : 0;
    entity.conversionGoals = Array.isArray(data.conversionGoals)
      ? (data.conversionGoals as ConversionGoal[])
      : undefined;
    entity.publishedAt =
      data.publishedAt instanceof Date
        ? data.publishedAt
        : typeof data.publishedAt === 'string'
          ? new Date(data.publishedAt)
          : undefined;
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
