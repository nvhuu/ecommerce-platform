import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PageStatus } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePageDto {
  @ApiProperty({ description: 'Page title' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Page URL slug' })
  @IsString()
  slug!: string;

  @ApiProperty({ description: 'Page content (HTML or JSON string)' })
  @IsString()
  content!: string;

  @ApiPropertyOptional({ description: 'Short excerpt/description' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ enum: PageStatus, default: PageStatus.DRAFT })
  @IsOptional()
  @IsEnum(PageStatus)
  status?: PageStatus;

  @ApiPropertyOptional({ description: 'Template name', default: 'default' })
  @IsOptional()
  @IsString()
  template?: string;

  // SEO fields
  @ApiPropertyOptional({ description: 'SEO title' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO meta description' })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'SEO keywords', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @ApiPropertyOptional({ description: 'Open Graph image URL' })
  @IsOptional()
  @IsString()
  ogImage?: string;
}
