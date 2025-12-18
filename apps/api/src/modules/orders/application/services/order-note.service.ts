import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IOrderNoteRepository } from '../../domain/repositories/order-note.repository.interface';
import {
  CreateOrderNoteDto,
  OrderNoteResponseDto,
  UpdateOrderNoteDto,
} from '../dtos/order-note.dto';

@Injectable()
export class OrderNoteService {
  constructor(
    @Inject('IOrderNoteRepository')
    private readonly repository: IOrderNoteRepository,
  ) {}

  async createNote(
    orderId: string,
    dto: CreateOrderNoteDto,
    userId: string,
  ): Promise<OrderNoteResponseDto> {
    const note = await this.repository.create({
      orderId,
      note: dto.note,
      isInternal: dto.isInternal ?? true,
      createdBy: userId,
    });
    return plainToInstance(OrderNoteResponseDto, note);
  }

  async getNotesByOrder(orderId: string): Promise<OrderNoteResponseDto[]> {
    const notes = await this.repository.findByOrderId(orderId);
    return plainToInstance(OrderNoteResponseDto, notes);
  }

  async updateNote(
    id: string,
    dto: UpdateOrderNoteDto,
  ): Promise<OrderNoteResponseDto> {
    const note = await this.repository.update(id, dto);
    return plainToInstance(OrderNoteResponseDto, note);
  }

  async deleteNote(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
