import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class OrderHistoryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty({ enum: OrderStatus, required: false })
  fromStatus?: OrderStatus;

  @ApiProperty({ enum: OrderStatus })
  toStatus!: OrderStatus;

  @ApiProperty({ required: false })
  note?: string;

  @ApiProperty()
  changedAt!: Date;

  @ApiProperty({ required: false })
  changedBy?: string;
}
