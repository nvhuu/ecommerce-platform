import { ContentType, WebhookEvent } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MinDate,
} from 'class-validator';

export class CreateScheduledContentDto {
  @IsEnum(ContentType)
  contentType!: ContentType;

  @IsMongoId()
  contentId!: string;

  @IsString()
  @IsNotEmpty()
  action!: string;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  scheduleAt!: Date;
}

export class CreateScheduledEmailDto {
  @IsString()
  @IsNotEmpty()
  templateKey!: string;

  @IsArray()
  @IsString({ each: true })
  recipients!: string[];

  @IsOptional()
  @IsObject()
  data?: any;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  scheduleAt!: Date;
}

export class CreateWebhookDto {
  @IsUrl()
  url!: string;

  @IsArray()
  @IsEnum(WebhookEvent, { each: true })
  events!: WebhookEvent[];

  @IsString()
  @IsNotEmpty()
  secret!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCronJobDto {
  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
