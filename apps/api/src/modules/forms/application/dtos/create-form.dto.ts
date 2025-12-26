import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormStatus } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { FieldDefinition } from '../../domain/entities/field-definition';

export class CreateFormDto {
  @ApiProperty({ example: 'Contact Form' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'contact-form' })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ example: 'Get in touch with us' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: [{ name: 'email', type: 'email', label: 'Email', required: true }],
  })
  @IsArray()
  fields!: FieldDefinition[];

  @ApiPropertyOptional({ enum: FormStatus, example: FormStatus.ACTIVE })
  @IsEnum(FormStatus)
  @IsOptional()
  status?: FormStatus;

  @ApiPropertyOptional({ example: 'admin@example.com' })
  @IsString()
  @IsOptional()
  notificationEmail?: string;

  @ApiPropertyOptional({ example: 'Thank you for your submission!' })
  @IsString()
  @IsOptional()
  successMessage?: string;

  @ApiPropertyOptional({ example: '/thank-you' })
  @IsString()
  @IsOptional()
  redirectUrl?: string;
}
