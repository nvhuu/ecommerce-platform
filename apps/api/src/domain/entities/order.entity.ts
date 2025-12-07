import { Expose } from 'class-transformer';
import { BaseEntity } from './base.entity';

export class OrderItem {
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

  static toDomain(data: any): OrderItem | null {
    if (!data) return null;
    const item = new OrderItem();
    item.id = data.id;
    item.orderId = data.orderId;
    item.productId = data.productId;
    item.quantity = data.quantity;
    item.price = data.price;
    return item;
  }
}

export class Order extends BaseEntity {
  @Expose()
  userId!: string;

  @Expose()
  status!: OrderStatus;

  @Expose()
  totalAmount!: number;

  @Expose()
  items?: OrderItem[];

  static toDomain(data: any): Order | null {
    if (!data) return null;
    const order = new Order();
    order.id = data.id;
    order.userId = data.userId;
    order.status = data.status;
    order.totalAmount = data.totalAmount;

    // Transform nested items if present
    if (data.items) {
      order.items = data.items
        .map((item: any) => OrderItem.toDomain(item))
        .filter((item: OrderItem | null): item is OrderItem => item !== null);
    }

    order.createdAt = data.createdAt;
    order.updatedAt = data.updatedAt;
    order.createdBy = data.createdBy;
    order.updatedBy = data.updatedBy;
    order.deletedAt = data.deletedAt;
    order.deletedBy = data.deletedBy;
    return order;
  }
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
