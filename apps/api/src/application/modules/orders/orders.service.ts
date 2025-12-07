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
import { toDto } from '../../utils/mapper.util';

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
      item.price = product.price; // Snapshot price
      items.push(item);

      totalAmount += product.price * item.quantity;
    }

    const order = new Order();
    order.userId = userId;
    order.items = items;
    order.totalAmount = totalAmount;
    order.status = OrderStatus.PENDING;

    const createdOrder = await this.orderRepository.create(order);
    return toDto(OrderResponseDto, createdOrder) as OrderResponseDto;
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findAll();
    return toDto(OrderResponseDto, orders) as OrderResponseDto[];
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return toDto(OrderResponseDto, order) as OrderResponseDto;
  }

  async findByUser(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByUser(userId);
    return toDto(OrderResponseDto, orders) as OrderResponseDto[];
  }

  async updateStatus(id: string, status: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.updateStatus(id, status);
    if (!order) throw new NotFoundException('Order not found');
    return toDto(OrderResponseDto, order) as OrderResponseDto;
  }
}
