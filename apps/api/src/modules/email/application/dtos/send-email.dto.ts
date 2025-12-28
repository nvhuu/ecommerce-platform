import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to!: string;

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsOptional()
  html?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  templateSlug?: string;

  @IsObject()
  @IsOptional()
  variables?: Record<string, unknown>;
}
