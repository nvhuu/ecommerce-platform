export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class OrderItem {
  id!: string;
  orderId!: string;
  productId!: string;
  quantity!: number;
  price!: number;
}

export class Order {
  id!: string;
  userId!: string;
  totalAmount!: number;
  status!: OrderStatus;
  items?: OrderItem[];
  createdAt!: Date;
  updatedAt!: Date;
}
