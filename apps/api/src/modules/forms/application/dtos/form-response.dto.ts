import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormStatus } from '@prisma/client';
import { FieldDefinition } from '../../domain/entities/field-definition';

export class FormResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  fields!: FieldDefinition[];

  @ApiProperty({ enum: FormStatus })
  status!: FormStatus;

  @ApiPropertyOptional()
  notificationEmail?: string;

  @ApiPropertyOptional()
  successMessage?: string;

  @ApiPropertyOptional()
  redirectUrl?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
