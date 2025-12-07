import { Order } from '../entities/order.entity';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findAll(options: { cursor?: string; page?: number; limit: number }): Promise<{
    data: Order[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }>;
  findById(id: string): Promise<Order | null>;
  findByUser(
    userId: string,
    options: {
      cursor?: string;
      page?: number;
      limit: number;
    },
  ): Promise<{
    data: Order[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }>;
  updateStatus(id: string, status: string): Promise<Order>;
}
