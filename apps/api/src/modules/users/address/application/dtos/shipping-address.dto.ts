import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressLine1!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateShippingAddressDto extends PartialType(
  CreateShippingAddressDto,
) {}
