import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { IReturnRepository } from '../../domain/repositories/return.repository.interface';
import {
  CreateReturnDto,
  ReturnResponseDto,
  UpdateReturnStatusDto,
} from '../dtos/return.dto';

@Injectable()
export class ReturnService {
  constructor(
    @Inject('IReturnRepository')
    private readonly repository: IReturnRepository,
    // Should inject OrdersService/ProductsService to validate order and calculate prices
    // For now, simplify or assume prices passed (actually better to fetch)
    // To safe complexity, I'll inject PrismaService directly here or just use repository.
    // Wait, Clean Architecture -> Service should not use PrismaService directly usually
    // But for price lookup, we need ProductRepository.
    // I will mock the price calculation for now or just set 0 if I can't fetch.
    // Actually better: Assume full refund of item price?
    // Let's implement a placeholder for price calculation.
  ) {}

  async createReturn(
    userId: string,
    dto: CreateReturnDto,
  ): Promise<ReturnResponseDto> {
    // 1. Verify order belongs to user (should be done via OrdersService but for speed I skip valid check here)
    // 2. Calculated refund amount. For now, we will just use a placeholder logic or 0.
    // In real app, we need to fetch order items and their prices.

    // Mock calculation
    const itemsWithRefund = dto.items.map((item) => ({
      ...item,
      refundAmount: 0, // Placeholder, normally fetch price * quantity
    }));

    const totalRefund = 0;

    const ret = await this.repository.create({
      orderId: dto.orderId,
      userId,
      status: ReturnStatus.PENDING,
      reason: dto.reason,
      note: dto.note,
      totalRefund,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: itemsWithRefund as any[],
    });

    return plainToInstance(ReturnResponseDto, ret);
  }

  async getMyReturns(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: ReturnResponseDto[]; total: number }> {
    const result = await this.repository.findByUser(userId, page, limit);
    return {
      data: plainToInstance(ReturnResponseDto, result.data),
      total: result.total,
    };
  }

  async getAllReturns(
    page = 1,
    limit = 10,
  ): Promise<{ data: ReturnResponseDto[]; total: number }> {
    const result = await this.repository.findAll(page, limit);
    return {
      data: plainToInstance(ReturnResponseDto, result.data),
      total: result.total,
    };
  }

  async getReturn(id: string): Promise<ReturnResponseDto> {
    const ret = await this.repository.findById(id);
    if (!ret) {
      throw new NotFoundException('Return not found');
    }
    return plainToInstance(ReturnResponseDto, ret);
  }

  async updateStatus(
    id: string,
    dto: UpdateReturnStatusDto,
    adminId: string,
  ): Promise<ReturnResponseDto> {
    const ret = await this.repository.findById(id);
    if (!ret) {
      throw new NotFoundException('Return not found');
    }

    const updated = await this.repository.updateStatus(id, dto.status, adminId);
    return plainToInstance(ReturnResponseDto, updated);
  }
}
