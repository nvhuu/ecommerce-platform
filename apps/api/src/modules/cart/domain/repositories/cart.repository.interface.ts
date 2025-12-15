import { Cart } from '../entities/cart.entity';

export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  create(cart: Cart): Promise<Cart>;
  update(cart: Cart): Promise<Cart>;
  delete(userId: string): Promise<void>;
  clear(userId: string): Promise<void>;
}
