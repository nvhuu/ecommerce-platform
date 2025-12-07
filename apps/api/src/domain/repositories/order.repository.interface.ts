import { Order } from '../entities/order.entity';

export interface IOrderRepository {
  create(order: Partial<Order>): Promise<Order>;
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByUser(userId: string): Promise<Order[]>;
  updateStatus(id: string, status: string): Promise<Order>; // Use string or enum
}
