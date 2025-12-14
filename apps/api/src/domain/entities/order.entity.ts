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

  static toDomain(input: unknown): OrderItem | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;
    const item = new OrderItem();
    item.id = data.id as string;
    item.orderId = data.orderId as string;
    item.productId = data.productId as string;
    item.quantity = Number(data.quantity);
    item.price = Number(data.price);
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
  shippingAddress?: string;

  @Expose()
  paymentMethod?: string;

  @Expose()
  items?: OrderItem[];

  static toDomain(input: unknown): Order | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;
    const order = new Order();
    order.id = data.id as string;
    order.userId = data.userId as string;
    order.status = data.status as OrderStatus;
    order.status = data.status as OrderStatus;
    order.totalAmount = Number(data.totalAmount);
    order.shippingAddress = data.shippingAddress as string | undefined;
    order.paymentMethod = data.paymentMethod as string | undefined;

    // Transform nested items if present
    if (Array.isArray(data.items)) {
      order.items = data.items
        .map((item) => OrderItem.toDomain(item))
        .filter((item): item is OrderItem => item !== null);
    }

    order.createdAt = data.createdAt as Date;
    order.updatedAt = data.updatedAt as Date;
    order.createdBy = data.createdBy as string;
    order.updatedBy = data.updatedBy as string;
    order.deletedAt = data.deletedAt ? (data.deletedAt as Date) : undefined;
    order.deletedBy = data.deletedBy ? (data.deletedBy as string) : undefined;
    return order;
  }
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
