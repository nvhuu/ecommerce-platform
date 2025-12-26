import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, SubmissionStatus } from '@prisma/client';

export class SubmissionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  formId!: string;

  @ApiProperty()
  data!: Prisma.JsonObject;

  @ApiProperty({ enum: SubmissionStatus })
  status!: SubmissionStatus;

  @ApiPropertyOptional()
  ip?: string;

  @ApiPropertyOptional()
  userAgent?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
