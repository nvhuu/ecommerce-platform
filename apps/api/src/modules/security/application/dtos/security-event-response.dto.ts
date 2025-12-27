import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SecurityEventSeverity, SecurityEventType } from '@prisma/client';

export class SecurityEventResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: SecurityEventType })
  type!: SecurityEventType;

  @ApiProperty({ enum: SecurityEventSeverity })
  severity!: SecurityEventSeverity;

  @ApiPropertyOptional()
  userId?: string;

  @ApiProperty()
  ip!: string;

  @ApiPropertyOptional()
  userAgent?: string;

  @ApiProperty()
  description!: string;

  @ApiPropertyOptional()
  data?: string;

  @ApiProperty()
  resolved!: boolean;

  @ApiPropertyOptional()
  resolvedBy?: string;

  @ApiPropertyOptional()
  resolvedAt?: Date;

  @ApiProperty()
  createdAt!: Date;
}
