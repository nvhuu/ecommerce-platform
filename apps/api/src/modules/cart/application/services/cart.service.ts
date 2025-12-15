import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem } from '../../domain/entities/cart.entity';
import { ICartRepository } from '../../domain/repositories/cart.repository.interface';
import { AddToCartDto, UpdateCartItemDto } from '../dtos/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      cart = new Cart();
      cart.id = `cart_${userId}_${Date.now()}`;
      cart.userId = userId;
      cart.items = [];
      await this.cartRepository.create(cart);
    }

    return cart;
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
      cart.items.push(item);
    }

    await this.cartRepository.update(cart);
    return item;
  }

  async updateItem(
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cart = await this.getCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    item.quantity = dto.quantity;
    await this.cartRepository.update(cart);
    return item;
  }

  async removeItem(userId: string, itemId: string): Promise<void> {
    const cart = await this.getCart(userId);
    const index = cart.items.findIndex((i) => i.id === itemId);

    if (index === -1) {
      throw new NotFoundException('Cart item not found');
    }

    cart.items.splice(index, 1);
    await this.cartRepository.update(cart);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepository.clear(userId);
  }
}
