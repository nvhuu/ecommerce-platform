import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { ShipmentStatus } from '@prisma/client';
import { Shipment } from '../../domain/entities/shipment.entity';
import { IShipmentRepository } from '../../domain/repositories/shipment.repository.interface';

@Injectable()
export class ShipmentRepository implements IShipmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(shipment: Partial<Shipment>): Promise<Shipment> {
    const created = await this.prisma.shipment.create({
      data: {
        orderId: shipment.orderId!,
        carrier: shipment.carrier!,
        trackingNumber: shipment.trackingNumber,
        status: shipment.status || 'PREPARING',
        shippingAddress: shipment.shippingAddress as never,
        estimatedDelivery: shipment.estimatedDelivery,
      },
    });

    const result = Shipment.toDomain(created);
    if (!result) throw new Error('Failed to create shipment');
    return result;
  }

  async findById(id: string): Promise<Shipment | null> {
    const shipment = await this.prisma.shipment.findUnique({ where: { id } });
    return shipment ? Shipment.toDomain(shipment) : null;
  }

  async findByOrderId(orderId: string): Promise<Shipment[]> {
    const shipments = await this.prisma.shipment.findMany({
      where: { orderId },
      orderBy: { createdAt: SortOrder.DESC },
    });

    return shipments
      .map((s) => Shipment.toDomain(s))
      .filter((s): s is Shipment => s !== null);
  }

  async updateStatus(id: string, status: ShipmentStatus): Promise<Shipment> {
    const updated = await this.prisma.shipment.update({
      where: { id },
      data: {
        status,
        ...(status === 'DELIVERED' && { actualDelivery: new Date() }),
      },
    });

    const result = Shipment.toDomain(updated);
    if (!result) throw new Error('Failed to update shipment');
    return result;
  }

  async updateTracking(
    id: string,
    trackingNumber: string,
    trackingHistory: Array<Record<string, unknown>>,
  ): Promise<Shipment> {
    const updated = await this.prisma.shipment.update({
      where: { id },
      data: {
        trackingNumber,
        trackingHistory: trackingHistory as never,
      },
    });

    const result = Shipment.toDomain(updated);
    if (!result) throw new Error('Failed to update tracking');
    return result;
  }
}
