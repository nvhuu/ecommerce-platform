import { PrismaService } from '@/core/prisma/prisma.service';
import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { Injectable } from '@nestjs/common';
import {
  OrderStatus,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from '@prisma/client';
import { Order } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';

type PrismaOrderWithItems = PrismaOrder & { items: PrismaOrderItem[] };

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Order>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(options.search ? { id: { contains: options.search } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    const orders = data
      .map((o: PrismaOrderWithItems) => Order.toDomain(o))
      .filter((o): o is Order => o !== null);

    return {
      data: orders,
      page,
      limit,
      total,
    };
  }

  async findByUserId(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResult<Order>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      deletedAt: null,
    };

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    const orders = data
      .map((o: PrismaOrderWithItems) => Order.toDomain(o))
      .filter((o): o is Order => o !== null);

    return {
      data: orders,
      page,
      limit,
      total,
    };
  }

  async findById(id: string): Promise<Order | null> {
    const data = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    return data ? Order.toDomain(data as PrismaOrderWithItems) : null;
  }

  async create(order: Order): Promise<Order> {
    const created = await this.prisma.order.create({
      data: {
        userId: order.userId,
        status: order.status as OrderStatus,
        totalAmount: order.totalAmount,
        items: {
          create: order.items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });
    const result = Order.toDomain(created as PrismaOrderWithItems);
    if (!result) throw new Error('Failed to create order');
    return result;
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status as OrderStatus }),
        ...(data.totalAmount !== undefined && {
          totalAmount: data.totalAmount,
        }),
      },
      include: { items: true },
    });
    const result = Order.toDomain(updated as PrismaOrderWithItems);
    if (!result) throw new Error('Failed to update order');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
