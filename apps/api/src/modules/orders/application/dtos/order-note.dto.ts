import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateOrderNoteDto {
  @ApiProperty()
  @IsString()
  note!: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isInternal?: boolean;
}

export class UpdateOrderNoteDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isInternal?: boolean;
}

export class OrderNoteResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty()
  note!: string;

  @ApiProperty()
  isInternal!: boolean;

  @ApiProperty()
  createdBy!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
