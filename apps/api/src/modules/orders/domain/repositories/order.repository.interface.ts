import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { Order } from '../entities/order.entity';

export interface IOrderRepository {
  findAll(options: PaginationOptions): Promise<PaginatedResult<Order>>;
  findByUserId(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResult<Order>>;
  findById(id: string): Promise<Order | null>;
  create(order: Order): Promise<Order>;
  update(id: string, data: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<void>;
}
