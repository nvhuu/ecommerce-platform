import { OrderStatus } from '@prisma/client';
import { OrderHistory } from '../entities/order-history.entity';

export interface IOrderHistoryRepository {
  create(history: Partial<OrderHistory>): Promise<OrderHistory>;
  findByOrderId(orderId: string): Promise<OrderHistory[]>;
  createStatusChange(
    orderId: string,
    fromStatus: OrderStatus | undefined,
    toStatus: OrderStatus,
    note?: string,
    userId?: string,
  ): Promise<OrderHistory>;
}
