import { BaseEntity } from '@/shared/domain/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ShippingAddress extends BaseEntity {
  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressLine1!: string;

  @Expose()
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city!: string;

  @Expose()
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @Expose()
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country!: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isDefault!: boolean;

  static toDomain(input: unknown): ShippingAddress | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    // Manual mapping safe for now
    const entity = new ShippingAddress();
    entity.id = data.id as string;
    entity.userId = data.userId as string;
    entity.fullName = data.fullName as string;
    entity.phoneNumber = data.phoneNumber as string;
    entity.addressLine1 = data.addressLine1 as string;
    entity.addressLine2 = data.addressLine2 as string;
    entity.city = data.city as string;
    entity.state = data.state as string;
    entity.postalCode = data.postalCode as string;
    entity.country = data.country as string;
    entity.isDefault = data.isDefault as boolean;
    entity.createdAt = data.createdAt as Date;
    entity.updatedAt = data.updatedAt as Date;

    return entity;
  }
}
