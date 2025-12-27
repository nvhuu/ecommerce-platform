import { Prisma } from '@prisma/client';
import { Popup } from '../entities/popup.entity';

export interface IPopupRepository {
  create(data: Prisma.PopupCreateInput): Promise<Popup>;

  findAll(filters?: { isActive?: boolean; type?: string }): Promise<Popup[]>;

  findById(id: string): Promise<Popup | null>;

  update(id: string, data: Prisma.PopupUpdateInput): Promise<Popup>;

  delete(id: string): Promise<void>;

  findActivePopups(): Promise<Popup[]>;

  trackImpression(id: string): Promise<void>;

  trackConversion(id: string): Promise<void>;

  trackDismiss(id: string): Promise<void>;
}

export const POPUP_REPOSITORY_TOKEN = 'IPopupRepository';
