import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  Order,
  OrderItem,
  OrderStatus,
} from '../../../domain/entities/order.entity';
import { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { CreateOrderDto } from '../../dtos/order.dto';
import { OrderResponseDto } from '../../dtos/response';
import { HybridPaginatedDto } from '../../dtos/response/hybrid-paginated.response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
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
      item.price = product.price;
      items.push(item);

      totalAmount += product.price * itemDto.quantity;
    }

    const order = new Order();
    order.userId = userId;
    order.status = OrderStatus.PENDING;
    order.totalAmount = totalAmount;
    order.items = items;

    const createdOrder = await this.orderRepository.create(order);
    return createdOrder;
  }

  async findAll(
    cursor?: string,
    page?: number,
    limit: number = 10,
  ): Promise<HybridPaginatedDto<OrderResponseDto>> {
    const result = await this.orderRepository.findAll({ cursor, page, limit });

    if (result.usedCursor) {
      return new HybridPaginatedDto(result.data, 'cursor', {
        hasNextPage: result.hasMore!,
        nextCursor: result.lastId
          ? Buffer.from(result.lastId).toString('base64')
          : undefined,
        limit,
      });
    } else {
      return new HybridPaginatedDto(result.data, 'offset', {
        total: result.total!,
        page: page || 1,
        limit,
      });
    }
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByUser(
    userId: string,
    cursor?: string,
    page?: number,
    limit: number = 10,
  ): Promise<HybridPaginatedDto<OrderResponseDto>> {
    const result = await this.orderRepository.findByUser(userId, {
      cursor,
      page,
      limit,
    });

    if (result.usedCursor) {
      return new HybridPaginatedDto(result.data, 'cursor', {
        hasNextPage: result.hasMore!,
        nextCursor: result.lastId
          ? Buffer.from(result.lastId).toString('base64')
          : undefined,
        limit,
      });
    } else {
      return new HybridPaginatedDto(result.data, 'offset', {
        total: result.total!,
        page: page || 1,
        limit,
      });
    }
  }

  async updateStatus(id: string, status: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const updated = await this.orderRepository.updateStatus(id, status);
    return updated;
  }
}
