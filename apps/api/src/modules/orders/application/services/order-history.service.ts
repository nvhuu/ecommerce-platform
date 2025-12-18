import { Inject, Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { IOrderHistoryRepository } from '../../domain/repositories/order-history.repository.interface';
import { OrderHistoryResponseDto } from '../dtos/response/order-history.response.dto';

@Injectable()
export class OrderHistoryService {
  constructor(
    @Inject('IOrderHistoryRepository')
    private readonly repository: IOrderHistoryRepository,
  ) {}

  async getOrderHistory(orderId: string): Promise<OrderHistoryResponseDto[]> {
    const histories = await this.repository.findByOrderId(orderId);
    return plainToInstance(OrderHistoryResponseDto, histories);
  }

  async trackStatusChange(
    orderId: string,
    fromStatus: OrderStatus | undefined,
    toStatus: OrderStatus,
    note?: string,
    userId?: string,
  ): Promise<OrderHistoryResponseDto> {
    const history = await this.repository.createStatusChange(
      orderId,
      fromStatus,
      toStatus,
      note,
      userId,
    );
    return plainToInstance(OrderHistoryResponseDto, history);
  }
}
