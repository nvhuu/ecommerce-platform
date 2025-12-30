import { Expose, Type } from 'class-transformer';
import {
  ConversionGoal,
  LandingPageStatus,
  SectionConfig,
} from '../../../domain/entities/landing-page.entity';

export class LandingPageResponseDto {
  @Expose()
  id!: string;

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

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export class VariantResponseDto {
  @Expose()
  id!: string;

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

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export class AnalyticsResponseDto {
  @Expose()
  totalViews!: number;

  @Expose()
  totalConversions!: number;

  @Expose()
  conversionRate!: number;

  @Expose()
  uniqueVisitors!: number;
}

export class AbTestResultDto {
  @Expose()
  variantId!: string;

  @Expose()
  variantName!: string;

  @Expose()
  views!: number;

  @Expose()
  conversions!: number;

  @Expose()
  conversionRate!: number;

  @Expose()
  isControl!: boolean;

  @Expose()
  isWinner!: boolean;
}

export class AbTestResultsDto {
  @Expose()
  landingPageId!: string;

  @Expose()
  @Type(() => AbTestResultDto)
  variants!: AbTestResultDto[];

  @Expose()
  bestPerformer?: AbTestResultDto;
}
