import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SettingType } from '@prisma/client';

export class SettingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  key!: string;

  @ApiProperty()
  value!: string;

  @ApiProperty({ enum: SettingType })
  type!: SettingType;

  @ApiProperty()
  category!: string;

  @ApiProperty()
  label!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  isPublic!: boolean;

  @ApiPropertyOptional()
  validation?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  // Parsed value based on type
  @ApiPropertyOptional()
  parsedValue?: string | number | boolean | object;
}
