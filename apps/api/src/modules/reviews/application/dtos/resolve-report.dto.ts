import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ResolveReportDto {
  @ApiProperty({ description: 'Resolution action taken', required: false })
  @IsString()
  @IsOptional()
  resolution?: string;

  @ApiProperty({ description: 'Admin notes', required: false })
  @IsString()
  @IsOptional()
  adminNotes?: string;
}
