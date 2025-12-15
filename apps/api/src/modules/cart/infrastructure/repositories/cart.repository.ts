import { Injectable } from '@nestjs/common';
import { Cart } from '../../domain/entities/cart.entity';
import { ICartRepository } from '../../domain/repositories/cart.repository.interface';

/**
 * In-memory Cart Repository
 * TODO: Replace with Redis or Prisma implementation
 */
@Injectable()
export class CartRepository implements ICartRepository {
  private carts: Map<string, Cart> = new Map();

  async findByUserId(userId: string): Promise<Cart | null> {
    return this.carts.get(userId) || null;
  }

  async create(cart: Cart): Promise<Cart> {
    cart.createdAt = new Date();
    cart.updatedAt = new Date();
    this.carts.set(cart.userId, cart);
    return cart;
  }

  async update(cart: Cart): Promise<Cart> {
    cart.updatedAt = new Date();
    this.carts.set(cart.userId, cart);
    return cart;
  }

  async delete(userId: string): Promise<void> {
    this.carts.delete(userId);
  }

  async clear(userId: string): Promise<void> {
    const cart = this.carts.get(userId);
    if (cart) {
      cart.items = [];
      cart.updatedAt = new Date();
    }
  }
}
