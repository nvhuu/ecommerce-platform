import { ApiProperty } from '@nestjs/swagger';
import { InventoryTransactionType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class InventoryTransactionResponseDto {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  productId!: string;

  @Expose()
  @ApiProperty()
  variantId?: string;

  @Expose()
  @ApiProperty({ enum: InventoryTransactionType })
  type!: InventoryTransactionType;

  @Expose()
  @ApiProperty()
  quantity!: number;

  @Expose()
  @ApiProperty()
  reference?: string;

  @Expose()
  @ApiProperty()
  note?: string;

  @Expose()
  @ApiProperty()
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  createdBy?: string;
}
