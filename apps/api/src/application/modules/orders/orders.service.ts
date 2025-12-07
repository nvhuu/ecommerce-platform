import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  Order,
  OrderItem,
  OrderStatus,
} from '../../../domain/entities/order.entity';
import { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { CreateOrderDto } from '../../dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('IOrderRepository')
    private orderRepository: IOrderRepository,
    @Inject('IProductRepository')
    private productRepository: IProductRepository,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const items: OrderItem[] = [];
    let totalAmount = 0;

    for (const itemDto of createOrderDto.items) {
      const product = await this.productRepository.findById(itemDto.productId);
      if (!product) {
        throw new NotFoundException(`Product ${itemDto.productId} not found`);
      }

      const item = new OrderItem();
      item.productId = product.id;
      item.quantity = itemDto.quantity;
      item.price = product.price; // Snapshot price
      items.push(item);

      totalAmount += product.price * item.quantity;
    }

    const order = new Order();
    order.userId = userId;
    order.items = items;
    order.totalAmount = totalAmount;
    order.status = OrderStatus.PENDING;

    return this.orderRepository.create(order);
  }

  findAll() {
    return this.orderRepository.findAll();
  }

  findOne(id: string) {
    return this.orderRepository.findById(id);
  }

  findByUser(userId: string) {
    return this.orderRepository.findByUser(userId);
  }

  updateStatus(id: string, status: string) {
    return this.orderRepository.updateStatus(id, status);
  }
}
