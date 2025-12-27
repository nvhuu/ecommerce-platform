import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityAction } from '@prisma/client';

export class ActivityLogResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: ActivityAction })
  action!: ActivityAction;

  @ApiProperty()
  resource!: string;

  @ApiPropertyOptional()
  resourceId?: string;

  @ApiPropertyOptional()
  changes?: string;

  @ApiProperty()
  ip!: string;

  @ApiPropertyOptional()
  userAgent?: string;

  @ApiProperty()
  createdAt!: Date;
}
