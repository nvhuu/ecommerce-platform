import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ReturnStatus } from '@prisma/client';
import { Return } from '../../domain/entities/return.entity';
import { IReturnRepository } from '../../domain/repositories/return.repository.interface';

@Injectable()
export class ReturnRepository implements IReturnRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Return> & { items: any[] }): Promise<Return> {
    const { items, ...returnData } = data;

    const created = await this.prisma.return.create({
      data: {
        orderId: returnData.orderId!,
        userId: returnData.userId!,
        status: returnData.status!,
        reason: returnData.reason!,
        note: returnData.note,
        totalRefund: returnData.totalRefund!,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            refundAmount: item.refundAmount,
            reason: item.reason,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    const result = Return.toDomain(created);
    if (!result) throw new Error('Failed to create return');
    return result;
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Return[]; total: number }> {
    const skip = (page - 1) * limit;

    const [returns, total] = await Promise.all([
      this.prisma.return.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      this.prisma.return.count(),
    ]);

    return {
      data: returns
        .map((r) => Return.toDomain(r))
        .filter((r): r is Return => r !== null),
      total,
    };
  }

  async findByUser(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: Return[]; total: number }> {
    const skip = (page - 1) * limit;

    const [returns, total] = await Promise.all([
      this.prisma.return.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      this.prisma.return.count({ where: { userId } }),
    ]);

    return {
      data: returns
        .map((r) => Return.toDomain(r))
        .filter((r): r is Return => r !== null),
      total,
    };
  }

  async findById(id: string): Promise<Return | null> {
    const ret = await this.prisma.return.findUnique({
      where: { id },
      include: { items: true },
    });
    return ret ? Return.toDomain(ret) : null;
  }

  async updateStatus(
    id: string,
    status: ReturnStatus,
    approvedBy?: string,
  ): Promise<Return> {
    const data: any = { status };
    if (status === ReturnStatus.APPROVED) {
      data.approvedAt = new Date();
      data.approvedBy = approvedBy;
    }

    const updated = await this.prisma.return.update({
      where: { id },
      data,
      include: { items: true },
    });

    const result = Return.toDomain(updated);
    if (!result) throw new Error('Failed to update return');
    return result;
  }
}
