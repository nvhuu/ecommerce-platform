import { Inject, Injectable } from '@nestjs/common';
import { ShipmentStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { IShipmentRepository } from '../../domain/repositories/shipment.repository.interface';
import { CreateShipmentDto, UpdateTrackingDto } from '../dtos/shipment.dto';

export class ShipmentResponseDto {
  id!: string;
  orderId!: string;
  carrier!: string;
  trackingNumber?: string;
  status!: string;
  shippingAddress!: Record<string, unknown>;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingHistory!: Array<Record<string, unknown>>;
  createdAt!: Date;
  updatedAt!: Date;
}

@Injectable()
export class ShipmentService {
  constructor(
    @Inject('IShipmentRepository')
    private readonly repository: IShipmentRepository,
  ) {}

  async createShipment(dto: CreateShipmentDto): Promise<ShipmentResponseDto> {
    const shipment = await this.repository.create({
      ...dto,
      estimatedDelivery: dto.estimatedDelivery
        ? new Date(dto.estimatedDelivery)
        : undefined,
    });
    return plainToInstance(ShipmentResponseDto, shipment);
  }

  async getShipmentsByOrder(orderId: string): Promise<ShipmentResponseDto[]> {
    const shipments = await this.repository.findByOrderId(orderId);
    return plainToInstance(ShipmentResponseDto, shipments);
  }

  async updateShipmentStatus(
    id: string,
    status: ShipmentStatus,
  ): Promise<ShipmentResponseDto> {
    const shipment = await this.repository.updateStatus(id, status);
    return plainToInstance(ShipmentResponseDto, shipment);
  }

  async updateTracking(
    id: string,
    dto: UpdateTrackingDto,
  ): Promise<ShipmentResponseDto> {
    const shipment = await this.repository.updateTracking(
      id,
      dto.trackingNumber,
      dto.trackingHistory,
    );
    return plainToInstance(ShipmentResponseDto, shipment);
  }
}
