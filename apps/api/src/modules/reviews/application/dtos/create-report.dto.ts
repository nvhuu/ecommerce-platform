import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ description: 'Review ID to report' })
  @IsString()
  @IsNotEmpty()
  reviewId!: string;

  @ApiProperty({
    description: 'Reason for reporting',
    enum: ['SPAM', 'INAPPROPRIATE', 'FAKE', 'OFFENSIVE', 'OTHER'],
  })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiProperty({ description: 'Additional details', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
