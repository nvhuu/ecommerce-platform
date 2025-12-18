import { BaseEntity } from '@/shared/domain/base.entity';
import { ShipmentStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class Shipment extends BaseEntity {
  @Expose()
  orderId!: string;

  @Expose()
  carrier!: string;

  @Expose()
  trackingNumber?: string;

  @Expose()
  status!: ShipmentStatus;

  @Expose()
  shippingAddress!: Record<string, unknown>;

  @Expose()
  estimatedDelivery?: Date;

  @Expose()
  actualDelivery?: Date;

  @Expose()
  trackingHistory!: Array<Record<string, unknown>>;

  static toDomain(input: unknown): Shipment | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const shipment = new Shipment();
    shipment.id = data.id as string;
    shipment.orderId = data.orderId as string;
    shipment.carrier = data.carrier as string;
    shipment.trackingNumber = data.trackingNumber as string | undefined;
    shipment.status = data.status as ShipmentStatus;
    shipment.shippingAddress = data.shippingAddress as Record<string, unknown>;
    shipment.estimatedDelivery = data.estimatedDelivery as Date | undefined;
    shipment.actualDelivery = data.actualDelivery as Date | undefined;
    shipment.trackingHistory =
      (data.trackingHistory as Array<Record<string, unknown>>) || [];
    shipment.createdAt = data.createdAt as Date;
    shipment.updatedAt = data.updatedAt as Date;

    return shipment;
  }
}
