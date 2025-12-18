import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty()
  @IsString()
  orderId!: string;

  @ApiProperty()
  @IsString()
  carrier!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiProperty()
  @IsObject()
  shippingAddress!: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  estimatedDelivery?: string;
}

export class UpdateTrackingDto {
  @ApiProperty()
  @IsString()
  trackingNumber!: string;

  @ApiProperty({ type: [Object] })
  trackingHistory!: Array<Record<string, unknown>>;
}
