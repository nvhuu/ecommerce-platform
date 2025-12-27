import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { OrderNote } from '../../domain/entities/order-note.entity';
import { IOrderNoteRepository } from '../../domain/repositories/order-note.repository.interface';

@Injectable()
export class OrderNoteRepository implements IOrderNoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(note: Partial<OrderNote>): Promise<OrderNote> {
    const created = await this.prisma.orderNote.create({
      data: {
        orderId: note.orderId!,
        note: note.note!,
        isInternal: note.isInternal ?? true,
        createdBy: note.createdBy!,
      },
    });

    const result = OrderNote.toDomain(created);
    if (!result) throw new Error('Failed to create order note');
    return result;
  }

  async findByOrderId(orderId: string): Promise<OrderNote[]> {
    const notes = await this.prisma.orderNote.findMany({
      where: { orderId },
      orderBy: { createdAt: SortOrder.DESC },
    });

    return notes
      .map((n) => OrderNote.toDomain(n))
      .filter((n): n is OrderNote => n !== null);
  }

  async update(id: string, note: Partial<OrderNote>): Promise<OrderNote> {
    const updated = await this.prisma.orderNote.update({
      where: { id },
      data: {
        note: note.note,
        isInternal: note.isInternal,
      },
    });

    const result = OrderNote.toDomain(updated);
    if (!result) throw new Error('Failed to update order note');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.orderNote.delete({ where: { id } });
  }
}
