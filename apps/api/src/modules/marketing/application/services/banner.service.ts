import { MESSAGES } from '@/shared/constants/messages.constant';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Banner } from '../../domain/entities/banner.entity';
import {
  BANNER_REPOSITORY_TOKEN,
  IBannerRepository,
} from '../../domain/repositories/banner.repository.interface';
import { CreateBannerDto, UpdateBannerDto } from '../dtos/banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @Inject(BANNER_REPOSITORY_TOKEN)
    private readonly bannerRepository: IBannerRepository,
  ) {}

  async create(dto: CreateBannerDto, createdBy: string): Promise<Banner> {
    return this.bannerRepository.create({
      ...dto,
      creator: { connect: { id: createdBy } },
    });
  }

  async findAll(filters?: {
    isActive?: boolean;
    position?: string;
  }): Promise<Banner[]> {
    return this.bannerRepository.findAll(filters);
  }

  async findById(id: string): Promise<Banner> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException(MESSAGES.BANNER.NOT_FOUND);
    }
    return banner;
  }

  async update(id: string, dto: UpdateBannerDto): Promise<Banner> {
    await this.findById(id);
    return this.bannerRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.bannerRepository.delete(id);
  }

  async getActiveBanners(position: string): Promise<Banner[]> {
    return this.bannerRepository.findActiveByPosition(position);
  }

  async trackImpression(id: string): Promise<void> {
    await this.bannerRepository.trackImpression(id);
  }

  async trackClick(id: string): Promise<void> {
    await this.bannerRepository.trackClick(id);
  }

  async toggleActive(id: string, isActive: boolean): Promise<Banner> {
    return this.bannerRepository.update(id, { isActive });
  }
}
