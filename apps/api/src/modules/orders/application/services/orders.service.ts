import { MESSAGES } from '@/shared/constants/messages.constant';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IProductRepository } from '../../../products/domain/repositories/product.repository.interface';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { CreateOrderDto } from '../dtos/order.dto';
import { OrderResponseDto } from '../dtos/response/order.response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Note: This is a simplified version
    // In a full implementation, you'd fetch items from cart
    const order = new Order();
    order.userId = userId;
    order.status = OrderStatus.PENDING;
    order.shippingAddress = dto.shippingAddress;
    order.paymentMethod = dto.paymentMethod || 'COD';
    order.items = []; // Items would come from cart in real implementation
    order.totalAmount = 0; // Would be calculated from cart items

    const created = await this.orderRepository.create(order);
    return {
      message: MESSAGES.ORDER.CREATED,
      data: plainToClass(OrderResponseDto, created),
    };
  }

  async findAll(page?: number, limit?: number, search?: string) {
    const result = await this.orderRepository.findAll({
      page,
      limit: limit || 10,
      search,
    });

    return {
      message: MESSAGES.ORDER.LIST_RETRIEVED,
      data: result.data.map((o) => plainToClass(OrderResponseDto, o)),
      page: result.page,
      limit: result.limit,
      total: result.total,
    };
  }

  async findByUser(userId: string, page?: number, limit?: number) {
    const result = await this.orderRepository.findByUserId(userId, {
      page,
      limit: limit || 10,
    });

    return {
      message: MESSAGES.ORDER.LIST_RETRIEVED,
      data: result.data.map((o) => plainToClass(OrderResponseDto, o)),
      page: result.page,
      limit: result.limit,
      total: result.total,
    };
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    }

    return {
      message: MESSAGES.ORDER.RETRIEVED,
      data: plainToClass(OrderResponseDto, order),
    };
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    }

    const updated = await this.orderRepository.update(id, { status });
    return {
      message: MESSAGES.ORDER.STATUS_UPDATED,
      data: plainToClass(OrderResponseDto, updated),
    };
  }
}
