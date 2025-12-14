import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  Order,
  OrderItem,
  OrderStatus,
} from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { CreateOrderDto } from '../dtos/order.dto';
import { OrderResponseDto } from '../dtos/response';
import { HybridPaginatedDto } from '../dtos/response/hybrid-paginated.response.dto';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { CartService } from './cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    private readonly cartService: CartService,
  ) {}

  async create(
    user: { id: string } | string,
    createOrderDto: CreateOrderDto,
  ): Promise<ServiceResponse<OrderResponseDto>> {
    const userId = typeof user === 'string' ? user : user.id;

    // 1. Fetch Cart
    const cart = await this.cartService.getCart(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const items: OrderItem[] = [];
    let totalAmount = 0;

    // 2. Validate Items, Check Stock, and Calculate Total
    for (const cartItem of cart.items) {
      const product = await this.productRepository.findById(cartItem.productId);
      if (!product) {
        throw new NotFoundException(`Product ${cartItem.productId} not found`);
      }

      if (product.stock < cartItem.quantity) {
        throw new NotFoundException(
          `Insufficient stock for product ${product.name}`,
        );
      }

      const item = new OrderItem();
      item.productId = product.id;
      item.quantity = cartItem.quantity;
      item.price = product.price;
      items.push(item);

      totalAmount += product.price * cartItem.quantity;
    }

    // 3. Create Order
    const order = new Order();
    order.userId = userId;
    order.status = OrderStatus.PENDING;
    order.totalAmount = totalAmount;
    order.items = items;
    order.shippingAddress = createOrderDto.shippingAddress;
    order.paymentMethod = createOrderDto.paymentMethod || 'COD';

    const createdOrder = await this.orderRepository.create(order);

    // 4. Update Stock
    for (const item of items) {
      // We fetch again or assume concurrency isn't an issue for this demo.
      // Ideally this should be transactional.
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        await this.productRepository.update(product.id, {
          stock: product.stock - item.quantity,
        });
      }
    }

    // 5. Clear Cart
    await this.cartService.clearCart(userId);

    return {
      message: 'Order created successfully',
      data: createdOrder,
    };
  }

  async findAll(
    cursor?: string,
    page?: number,
    limit: number = 10,
    search?: string,
  ): Promise<ServiceResponse<HybridPaginatedDto<OrderResponseDto>>> {
    const result = await this.orderRepository.findAll({
      cursor,
      page,
      limit,
      search,
    });

    let data: HybridPaginatedDto<OrderResponseDto>;

    if (result.usedCursor) {
      data = new HybridPaginatedDto(result.data, 'cursor', {
        hasNextPage: result.hasMore!,
        nextCursor: result.lastId
          ? Buffer.from(result.lastId).toString('base64')
          : undefined,
        limit,
      });
    } else {
      data = new HybridPaginatedDto(result.data, 'offset', {
        total: result.total!,
        page: page || 1,
        limit,
      });
    }

    return {
      message: 'Orders retrieved successfully',
      data,
    };
  }

  async findOne(id: string): Promise<ServiceResponse<OrderResponseDto>> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return {
      message: 'Order retrieved successfully',
      data: order,
    };
  }

  async findByUser(
    userId: string,
    cursor?: string,
    page?: number,
    limit: number = 10,
  ): Promise<ServiceResponse<HybridPaginatedDto<OrderResponseDto>>> {
    const result = await this.orderRepository.findByUser(userId, {
      cursor,
      page,
      limit,
    });

    let data: HybridPaginatedDto<OrderResponseDto>;

    if (result.usedCursor) {
      data = new HybridPaginatedDto(result.data, 'cursor', {
        hasNextPage: result.hasMore!,
        nextCursor: result.lastId
          ? Buffer.from(result.lastId).toString('base64')
          : undefined,
        limit,
      });
    } else {
      data = new HybridPaginatedDto(result.data, 'offset', {
        total: result.total!,
        page: page || 1,
        limit,
      });
    }

    return {
      message: 'Orders retrieved successfully',
      data,
    };
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<ServiceResponse<OrderResponseDto>> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const updated = await this.orderRepository.updateStatus(id, status);
    return {
      message: 'Order status updated successfully',
      data: updated,
    };
  }
}
