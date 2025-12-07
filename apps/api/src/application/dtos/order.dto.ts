import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  productId!: string;

  @IsNumber()
  @IsPositive()
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
