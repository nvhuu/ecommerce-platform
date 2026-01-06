import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { LoyaltyService } from '../../../loyalty/application/services/loyalty.service';
import { IProductRepository } from '../../../products/domain/repositories/product.repository.interface';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { isValidTransition } from '../../domain/validators/order-status.validator';
import { CreateOrderDto } from '../dtos/order.dto';
import { OrderResponseDto } from '../dtos/response/order.response.dto';
import { OrderHistoryService } from './order-history.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    private readonly orderHistoryService: OrderHistoryService,
    private readonly loyaltyService: LoyaltyService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const order = new Order();
    order.userId = userId;
    order.status = OrderStatus.PENDING;
    order.shippingAddress = dto.shippingAddress;
    order.paymentMethod = dto.paymentMethod || 'COD';
    order.items = [];
    order.totalAmount = 0;

    const created = await this.orderRepository.create(order);

    // Auto-track order creation
    await this.orderHistoryService.trackStatusChange(
      created.id,
      undefined,
      OrderStatus.PENDING,
      'Order created',
      userId,
    );

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

  async updateStatus(id: string, status: OrderStatus, userId?: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    }

    // Validate status transition
    if (!isValidTransition(order.status, status)) {
      throw new BadRequestException(
        `Cannot transition order from ${order.status} to ${status}`,
      );
    }

    const updated = await this.orderRepository.update(id, { status });

    // Auto-track status change
    await this.orderHistoryService.trackStatusChange(
      id,
      order.status,
      status,
      `Status changed from ${order.status} to ${status}`,
      userId,
    );

    // Award loyalty points when order is completed
    if (
      status === OrderStatus.COMPLETED &&
      order.status !== OrderStatus.COMPLETED
    ) {
      try {
        await this.loyaltyService.earnPoints(
          order.userId,
          order.id,
          order.totalAmount,
        );
      } catch (error) {
        // Log error but don't fail the order update
        console.error('Failed to award loyalty points:', error);
      }
    }

    return {
      message: MESSAGES.ORDER.UPDATED,
      data: plainToClass(OrderResponseDto, updated),
    };
  }

  async cancel(id: string, userId: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    }

    if (order.userId !== userId) {
      throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Cannot cancel order with status ${order.status}. Only PENDING orders can be cancelled.`,
      );
    }

    const updated = await this.orderRepository.update(id, {
      status: OrderStatus.CANCELLED,
    });

    await this.orderHistoryService.trackStatusChange(
      id,
      order.status,
      OrderStatus.CANCELLED,
      'User cancelled order',
      userId,
    );

    return {
      message: MESSAGES.ORDER.CANCELLED,
      data: plainToClass(OrderResponseDto, updated),
    };
  }
}
