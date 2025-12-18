import { OrderNote } from '../entities/order-note.entity';

export interface IOrderNoteRepository {
  create(note: Partial<OrderNote>): Promise<OrderNote>;
  findByOrderId(orderId: string): Promise<OrderNote[]>;
  update(id: string, note: Partial<OrderNote>): Promise<OrderNote>;
  delete(id: string): Promise<void>;
}
