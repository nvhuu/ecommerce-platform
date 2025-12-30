import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoyaltyTransaction } from '../../domain/entities/loyalty-transaction.entity';
import {
  ILoyaltyRepository,
  PaginatedResult,
  PaginationOptions,
} from '../../domain/repositories/loyalty.repository.interface';

@Injectable()
export class LoyaltyRepository implements ILoyaltyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(
    data: Partial<LoyaltyTransaction>,
  ): Promise<LoyaltyTransaction> {
    const transaction = await this.prisma.loyaltyTransaction.create({
      data: {
        user: { connect: { id: data.userId! } },
        type: data.type!,
        points: data.points!,
        description: data.description!,
        orderId: data.orderId,
        metadata: data.metadata as Prisma.InputJsonValue,
        createdBy: data.createdBy,
      },
    });

    const domain = LoyaltyTransaction.toDomain(transaction);
    if (!domain) {
      throw new Error('Failed to convert transaction to domain entity');
    }
    return domain;
  }

  async findByUserId(
    userId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<LoyaltyTransaction>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const sortOrder =
      pagination.sortOrder === SortOrder.ASC ? SortOrder.ASC : SortOrder.DESC;

    const [transactions, total] = await Promise.all([
      this.prisma.loyaltyTransaction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      this.prisma.loyaltyTransaction.count({ where: { userId } }),
    ]);

    const data = transactions
      .map((t) => LoyaltyTransaction.toDomain(t))
      .filter((t): t is LoyaltyTransaction => t !== null);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserBalance(userId: string): Promise<number> {
    const result = await this.prisma.loyaltyTransaction.aggregate({
      where: { userId },
      _sum: { points: true },
    });

    return result._sum.points || 0;
  }

  async findById(id: string): Promise<LoyaltyTransaction | null> {
    const transaction = await this.prisma.loyaltyTransaction.findUnique({
      where: { id },
    });

    if (!transaction) return null;
    return LoyaltyTransaction.toDomain(transaction);
  }

  async findByOrderId(orderId: string): Promise<LoyaltyTransaction[]> {
    const transactions = await this.prisma.loyaltyTransaction.findMany({
      where: { orderId },
    });

    return transactions
      .map((t) => LoyaltyTransaction.toDomain(t))
      .filter((t): t is LoyaltyTransaction => t !== null);
  }
}
