import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem } from '../../domain/entities/cart.entity';
import { AddToCartDto, UpdateCartItemDto } from '../dtos/cart.dto';

@Injectable()
export class CartService {
  // Mock In-Memory Storage
  private carts: Map<string, Cart> = new Map();

  constructor() {}

  async getCart(userId: string): Promise<Cart> {
    if (!this.carts.has(userId)) {
      const newCart = new Cart();
      newCart.id = `cart_${userId}_${Date.now()}`;
      newCart.userId = userId;
      newCart.items = [];
      newCart.createdAt = new Date();
      newCart.updatedAt = new Date();
      this.carts.set(userId, newCart);
    }
    return this.carts.get(userId)!;
  }

  async addToCart(userId: string, dto: AddToCartDto): Promise<CartItem> {
    const cart = await this.getCart(userId);
    let item = cart.items.find((i) => i.productId === dto.productId);

    if (item) {
      item.quantity += dto.quantity;
    } else {
      item = new CartItem();
      item.id = `item_${Date.now()}_${Math.random()}`;
      item.cartId = cart.id;
      item.productId = dto.productId;
      item.quantity = dto.quantity;
      // Mock product relation if needed, or leave undefined
      cart.items.push(item);
    }

    this.carts.set(userId, cart);
    return item;
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cart = await this.getCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) throw new NotFoundException('Item not found');

    item.quantity = dto.quantity;
    this.carts.set(userId, cart); // Update reference
    return item;
  }

  async removeCartItem(userId: string, itemId: string): Promise<void> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((i) => i.id !== itemId);
    this.carts.set(userId, cart);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getCart(userId);
    cart.items = [];
    this.carts.set(userId, cart);
  }
}
