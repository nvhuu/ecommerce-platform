import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ example: 'My Folder', description: 'Name of the folder' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: 'ID of the parent folder' })
  @IsString()
  @IsOptional()
  parentId?: string;
}

export class MediaFilterDto {
  @ApiProperty({ required: false, description: 'Filter by folder ID' })
  @IsString()
  @IsOptional()
  folderId?: string;
}
