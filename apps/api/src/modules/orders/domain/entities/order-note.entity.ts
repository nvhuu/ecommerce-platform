import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export class OrderNote extends BaseEntity {
  @Expose()
  orderId!: string;

  @Expose()
  note!: string;

  @Expose()
  isInternal!: boolean;

  static toDomain(input: unknown): OrderNote | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const note = new OrderNote();
    note.id = data.id as string;
    note.orderId = data.orderId as string;
    note.note = data.note as string;
    note.isInternal = data.isInternal as boolean;
    note.createdBy = data.createdBy as string;
    note.createdAt = data.createdAt as Date;
    note.updatedAt = data.updatedAt as Date;

    return note;
  }
}
