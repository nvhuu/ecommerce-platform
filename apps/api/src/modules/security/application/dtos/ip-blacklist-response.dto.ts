import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlockType } from '@prisma/client';

export class IPBlacklistResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  ip!: string;

  @ApiProperty({ enum: BlockType })
  type!: BlockType;

  @ApiProperty()
  reason!: string;

  @ApiPropertyOptional()
  blockedBy?: string;

  @ApiPropertyOptional()
  expiresAt?: Date;

  @ApiProperty()
  createdAt!: Date;
}
