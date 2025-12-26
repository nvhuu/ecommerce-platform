import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SettingType } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({ example: 'site_title' })
  @IsString()
  key!: string;

  @ApiProperty({ example: 'My E-commerce Store' })
  @IsString()
  value!: string;

  @ApiProperty({ enum: SettingType, example: SettingType.STRING })
  @IsEnum(SettingType)
  type!: SettingType;

  @ApiPropertyOptional({ example: 'general' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ example: 'Site Title' })
  @IsString()
  label!: string;

  @ApiPropertyOptional({ example: 'The title of your website' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({ example: '{"minLength": 3}' })
  @IsString()
  @IsOptional()
  validation?: string;
}
