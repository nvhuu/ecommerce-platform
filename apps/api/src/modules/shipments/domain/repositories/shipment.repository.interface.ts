import { ShipmentStatus } from '@prisma/client';
import { Shipment } from '../entities/shipment.entity';

export interface IShipmentRepository {
  create(shipment: Partial<Shipment>): Promise<Shipment>;
  findById(id: string): Promise<Shipment | null>;
  findByOrderId(orderId: string): Promise<Shipment[]>;
  updateStatus(id: string, status: ShipmentStatus): Promise<Shipment>;
  updateTracking(
    id: string,
    trackingNumber: string,
    trackingHistory: Array<Record<string, unknown>>,
  ): Promise<Shipment>;
}
