import { Prisma } from '@prisma/client';
import { Banner } from '../entities/banner.entity';

export interface IBannerRepository {
  create(data: Prisma.BannerCreateInput): Promise<Banner>;

  findAll(filters?: {
    isActive?: boolean;
    position?: string;
  }): Promise<Banner[]>;

  findById(id: string): Promise<Banner | null>;

  update(id: string, data: Prisma.BannerUpdateInput): Promise<Banner>;

  delete(id: string): Promise<void>;

  findActiveByPosition(position: string): Promise<Banner[]>;

  trackImpression(id: string): Promise<void>;

  trackClick(id: string): Promise<void>;
}

export const BANNER_REPOSITORY_TOKEN = 'IBannerRepository';
