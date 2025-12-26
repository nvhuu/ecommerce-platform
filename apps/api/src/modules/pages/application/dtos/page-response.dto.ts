import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PageStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class PageResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  title!: string;

  @ApiProperty()
  @Expose()
  slug!: string;

  @ApiProperty()
  @Expose()
  content!: string;

  @ApiPropertyOptional()
  @Expose()
  excerpt?: string;

  @ApiProperty({ enum: PageStatus })
  @Expose()
  status!: PageStatus;

  @ApiPropertyOptional()
  @Expose()
  template!: string;

  @ApiPropertyOptional()
  @Expose()
  seoTitle?: string;

  @ApiPropertyOptional()
  @Expose()
  seoDescription?: string;

  @ApiProperty({ type: [String] })
  @Expose()
  seoKeywords!: string[];

  @ApiPropertyOptional()
  @Expose()
  publishedAt?: Date;

  @ApiPropertyOptional()
  @Expose()
  createdBy?: string;

  @ApiPropertyOptional()
  @Expose()
  updatedBy?: string;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;
}
