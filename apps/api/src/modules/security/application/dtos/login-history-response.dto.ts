import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoginStatus } from '@prisma/client';

export class LoginHistoryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional()
  userId?: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: LoginStatus })
  status!: LoginStatus;

  @ApiPropertyOptional()
  failReason?: string;

  @ApiProperty()
  ip!: string;

  @ApiPropertyOptional()
  userAgent?: string;

  @ApiProperty()
  createdAt!: Date;
}
