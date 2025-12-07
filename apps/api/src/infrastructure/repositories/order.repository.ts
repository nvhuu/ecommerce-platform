import { Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { OrderStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<Order> {
    const createdOrder = await this.prisma.order.create({
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
    return Order.toDomain(createdOrder)!;
  }

  async findAll(options: {
    cursor?: string;
    page?: number;
    limit: number;
  }): Promise<{
    data: Order[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }> {
    if (options.cursor) {
      // Cursor pagination
      const decodedCursor = Buffer.from(options.cursor, 'base64').toString();

      const data = await this.prisma.order.findMany({
        take: options.limit + 1,
        cursor: { id: decodedCursor },
        skip: 1,
        where: { deletedAt: null },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });

      const hasMore = data.length > options.limit;
      const results = hasMore ? data.slice(0, options.limit) : data;
      const lastId =
        results.length > 0 ? results[results.length - 1].id : undefined;

      return {
        data: results
          .map((o: any) => Order.toDomain(o))
          .filter((o: Order | null): o is Order => o !== null),
        hasMore,
        lastId,
        usedCursor: true,
      };
    } else {
      // Offset pagination
      const skip = ((options.page || 1) - 1) * options.limit;

      const [data, total] = await Promise.all([
        this.prisma.order.findMany({
          where: { deletedAt: null },
          skip,
          take: options.limit,
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.order.count({
          where: { deletedAt: null },
        }),
      ]);

      return {
        data: data
          .map((o: any) => Order.toDomain(o))
          .filter((o: Order | null): o is Order => o !== null),
        total,
        usedCursor: false,
      };
    }
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order || order.deletedAt) return null;
    return Order.toDomain(order);
  }

  async findByUser(
    userId: string,
    options: {
      cursor?: string;
      page?: number;
      limit: number;
    },
  ): Promise<{
    data: Order[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }> {
    if (options.cursor) {
      // Cursor pagination
      const decodedCursor = Buffer.from(options.cursor, 'base64').toString();

      const data = await this.prisma.order.findMany({
        take: options.limit + 1,
        cursor: { id: decodedCursor },
        skip: 1,
        where: {
          userId,
          deletedAt: null,
        },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });

      const hasMore = data.length > options.limit;
      const results = hasMore ? data.slice(0, options.limit) : data;
      const lastId =
        results.length > 0 ? results[results.length - 1].id : undefined;

      return {
        data: results
          .map((o: any) => Order.toDomain(o))
          .filter((o: Order | null): o is Order => o !== null),
        hasMore,
        lastId,
        usedCursor: true,
      };
    } else {
      // Offset pagination
      const skip = ((options.page || 1) - 1) * options.limit;

      const [data, total] = await Promise.all([
        this.prisma.order.findMany({
          where: {
            userId,
            deletedAt: null,
          },
          skip,
          take: options.limit,
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.order.count({
          where: {
            userId,
            deletedAt: null,
          },
        }),
      ]);

      return {
        data: data
          .map((o: any) => Order.toDomain(o))
          .filter((o: Order | null): o is Order => o !== null),
        total,
        usedCursor: false,
      };
    }
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: { items: true },
    });
    return Order.toDomain(updated)!;
  }
}
