import { Expose, Type } from 'class-transformer';
import { OrderStatus } from '../../../domain/entities/order.entity';

export class OrderItemResponseDto {
  @Expose()
  id!: string;

  @Expose()
  orderId!: string;

  @Expose()
  productId!: string;

  @Expose()
  quantity!: number;

  @Expose()
  price!: number;
}

export class OrderResponseDto {
  @Expose()
  id!: string;

  @Expose()
  userId!: string;

  @Expose()
  totalAmount!: number;

  @Expose()
  status!: OrderStatus;

  @Expose()
  @Type(() => OrderItemResponseDto)
  items?: OrderItemResponseDto[];

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
