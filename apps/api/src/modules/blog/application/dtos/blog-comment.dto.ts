import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBlogCommentDto {
  @ApiProperty({ example: 'Great post!' })
  @IsNotEmpty()
  @IsString()
  content!: string;

  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  @IsNotEmpty()
  @IsString()
  postId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  parentId?: string;

  // Guest fields
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  guestEmail?: string;
}

export class UpdateBlogCommentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
