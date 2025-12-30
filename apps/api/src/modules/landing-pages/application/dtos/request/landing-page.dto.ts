import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  ConversionGoal,
  SectionConfig,
} from '../../../domain/entities/landing-page.entity';

export class CreateLandingPageDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  sections!: SectionConfig[];

  @IsOptional()
  @IsBoolean()
  isAbTest?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  conversionGoals?: ConversionGoal[];
}

export class UpdateLandingPageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  sections?: SectionConfig[];

  @IsOptional()
  @IsBoolean()
  isAbTest?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  conversionGoals?: ConversionGoal[];
}

export class CreateVariantDto {
  @IsString()
  name!: string;

  @IsOptional()
  trafficWeight?: number;

  @IsOptional()
  @IsBoolean()
  isControl?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  sections!: SectionConfig[];
}

export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  trafficWeight?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  sections?: SectionConfig[];
}

export class TrackEventDto {
  @IsString()
  eventType!: string;

  @IsOptional()
  @IsString()
  sectionType?: string;

  @IsOptional()
  @IsString()
  conversionGoal?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}
