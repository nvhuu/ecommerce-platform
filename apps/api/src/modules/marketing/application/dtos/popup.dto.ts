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
} from 'class-validator';

export class CreatePopupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ default: 'modal' })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ default: 'immediate' })
  @IsString()
  @IsNotEmpty()
  trigger!: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  delay?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  position?: string;

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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  conversionGoal?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  variant?: string;
}

export class UpdatePopupDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  trigger?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  delay?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  position?: string;

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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  conversionGoal?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  variant?: string;
}
