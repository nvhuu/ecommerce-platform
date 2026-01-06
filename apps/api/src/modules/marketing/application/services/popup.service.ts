import { MESSAGES } from '@/shared/constants/messages.constant';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Popup } from '../../domain/entities/popup.entity';
import {
  IPopupRepository,
  POPUP_REPOSITORY_TOKEN,
} from '../../domain/repositories/popup.repository.interface';
import { CreatePopupDto, UpdatePopupDto } from '../dtos/popup.dto';

@Injectable()
export class PopupService {
  constructor(
    @Inject(POPUP_REPOSITORY_TOKEN)
    private readonly popupRepository: IPopupRepository,
  ) {}

  async create(dto: CreatePopupDto, createdBy: string): Promise<Popup> {
    return this.popupRepository.create({
      ...dto,
      name: dto.title, // Use title as name
      creator: { connect: { id: createdBy } },
    });
  }

  async findAll(filters?: {
    isActive?: boolean;
    type?: string;
  }): Promise<Popup[]> {
    return this.popupRepository.findAll(filters);
  }

  async findById(id: string): Promise<Popup> {
    const popup = await this.popupRepository.findById(id);
    if (!popup) {
      throw new NotFoundException(MESSAGES.POPUP.NOT_FOUND);
    }
    return popup;
  }

  async update(id: string, dto: UpdatePopupDto): Promise<Popup> {
    await this.findById(id);
    return this.popupRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.popupRepository.delete(id);
  }

  async getActivePopups(): Promise<Popup[]> {
    return this.popupRepository.findActivePopups();
  }

  async trackImpression(id: string): Promise<void> {
    await this.popupRepository.trackImpression(id);
  }

  async trackConversion(id: string): Promise<void> {
    await this.popupRepository.trackConversion(id);
  }

  async trackDismiss(id: string): Promise<void> {
    await this.popupRepository.trackDismiss(id);
  }

  async toggleActive(id: string, isActive: boolean): Promise<Popup> {
    return this.popupRepository.update(id, { isActive });
  }
}
