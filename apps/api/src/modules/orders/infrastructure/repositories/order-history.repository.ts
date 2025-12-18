import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrderHistory } from '../../domain/entities/order-history.entity';
import { IOrderHistoryRepository } from '../../domain/repositories/order-history.repository.interface';

@Injectable()
export class OrderHistoryRepository implements IOrderHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(history: Partial<OrderHistory>): Promise<OrderHistory> {
    const created = await this.prisma.orderHistory.create({
      data: {
        orderId: history.orderId!,
        fromStatus: history.fromStatus,
        toStatus: history.toStatus!,
        note: history.note,
        changedBy: history.changedBy,
      },
    });

    const result = OrderHistory.toDomain(created);
    if (!result) throw new Error('Failed to create order history');
    return result;
  }

  async findByOrderId(orderId: string): Promise<OrderHistory[]> {
    const histories = await this.prisma.orderHistory.findMany({
      where: { orderId },
      orderBy: { changedAt: 'asc' },
    });

    return histories
      .map((h) => OrderHistory.toDomain(h))
      .filter((h): h is OrderHistory => h !== null);
  }

  async createStatusChange(
    orderId: string,
    fromStatus: OrderStatus | undefined,
    toStatus: OrderStatus,
    note?: string,
    userId?: string,
  ): Promise<OrderHistory> {
    return this.create({
      orderId,
      fromStatus,
      toStatus,
      note,
      changedBy: userId,
    });
  }
}
