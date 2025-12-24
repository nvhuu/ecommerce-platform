import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BlogPostStatus } from '../../domain/entities/blog-post.entity';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'My First Post' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'my-first-post' })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiProperty({ example: 'Short summary...', required: false })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ example: '<p>Content goes here</p>' })
  @IsNotEmpty()
  @IsString()
  content!: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @ApiProperty({ enum: BlogPostStatus, default: BlogPostStatus.DRAFT })
  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  categoryId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];
}

import { PartialType } from '@nestjs/swagger';

export class UpdateBlogPostDto extends PartialType(CreateBlogPostDto) {}
