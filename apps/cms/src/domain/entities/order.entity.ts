export interface Order {
  id: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface OrderFilters {
  status?: OrderStatus;
  userId?: string;
  startDate?: string;
  endDate?: string;
}
