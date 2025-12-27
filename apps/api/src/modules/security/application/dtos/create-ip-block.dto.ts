import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlockType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateIPBlockDto {
  @ApiProperty({ example: '192.168.1.1' })
  @IsIP()
  ip!: string;

  @ApiProperty({ enum: BlockType })
  @IsEnum(BlockType)
  type!: BlockType;

  @ApiProperty()
  @IsString()
  reason!: string;

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
