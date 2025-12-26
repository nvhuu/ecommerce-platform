import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MenuLocation } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

export class MenuItemResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  label!: string;

  @ApiProperty()
  @Expose()
  url!: string;

  @ApiPropertyOptional()
  @Expose()
  icon?: string;

  @ApiProperty()
  @Expose()
  order!: number;

  @ApiProperty()
  @Expose()
  isActive!: boolean;

  @ApiProperty()
  @Expose()
  openInNewTab!: boolean;

  @ApiPropertyOptional()
  @Expose()
  parentId?: string;

  @ApiPropertyOptional()
  @Expose()
  requiredRole?: string;

  @ApiProperty({ type: () => [MenuItemResponseDto] })
  @Expose()
  @Type(() => MenuItemResponseDto)
  children!: MenuItemResponseDto[];

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;
}

export class MenuResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty({ enum: MenuLocation })
  @Expose()
  location!: MenuLocation;

  @ApiProperty()
  @Expose()
  isActive!: boolean;

  @ApiProperty({ type: [MenuItemResponseDto] })
  @Expose()
  @Type(() => MenuItemResponseDto)
  items!: MenuItemResponseDto[];

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;
}
