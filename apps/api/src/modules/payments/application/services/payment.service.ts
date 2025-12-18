import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { CreatePaymentDto, ProcessRefundDto } from '../dtos/payment.dto';

export class PaymentResponseDto {
  id!: string;
  orderId!: string;
  amount!: number;
  currency!: string;
  method!: string;
  status!: string;
  gatewayTransactionId?: string;
  refundedAmount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

@Injectable()
export class PaymentService {
  constructor(
    @Inject('IPaymentRepository')
    private readonly repository: IPaymentRepository,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.repository.create(dto);
    return plainToInstance(PaymentResponseDto, payment);
  }

  async getPaymentsByOrder(orderId: string): Promise<PaymentResponseDto[]> {
    const payments = await this.repository.findByOrderId(orderId);
    return plainToInstance(PaymentResponseDto, payments);
  }

  async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
  ): Promise<PaymentResponseDto> {
    const payment = await this.repository.updateStatus(id, status);
    return plainToInstance(PaymentResponseDto, payment);
  }

  async processRefund(
    id: string,
    dto: ProcessRefundDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const refunded = await this.repository.processRefund(
      id,
      dto.amount,
      dto.reason,
    );
    return plainToInstance(PaymentResponseDto, refunded);
  }
}
