import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  imageUrl!: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  linkUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiProperty({ default: 'HOME_HERO' })
  @IsString()
  @IsNotEmpty()
  position!: string;

  @ApiProperty({ default: 0 })
  @IsInt()
  @IsNotEmpty()
  priority!: number;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  targetAudience?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  displayRules?: Record<string, unknown>;
}

export class UpdateBannerDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  linkUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  priority?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  targetAudience?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  displayRules?: Record<string, unknown>;
}
