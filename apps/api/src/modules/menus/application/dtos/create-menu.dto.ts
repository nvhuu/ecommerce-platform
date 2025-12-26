import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MenuLocation } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: 'Menu display name' })
  @IsString()
  name!: string;

  @ApiProperty({ enum: MenuLocation, description: 'Menu location' })
  @IsEnum(MenuLocation)
  location!: MenuLocation;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
