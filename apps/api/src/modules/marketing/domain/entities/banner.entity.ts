import { Expose } from 'class-transformer';
import { BaseEntity } from '@/shared/domain/base.entity';

export class Banner extends BaseEntity {

  @Expose()
  title!: string;

  @Expose()
  description?: string;

  @Expose()
  imageUrl!: string;

  @Expose()
  linkUrl?: string;

  @Expose()
  position!: string;

  @Expose()
  priority!: number;

  @Expose()
  targetPages!: string[];

  @Expose()
  targetUserType?: string;

  @Expose()
  startDate?: Date;

  @Expose()
  endDate?: Date;

  @Expose()
  isActive!: boolean;

  @Expose()
  impressions!: number;

  @Expose()
  clicks!: number;




  static toDomain(input: unknown): Banner | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const banner = new Banner();
    banner.id = data.id as string;
    banner.title = data.title as string;
    banner.description = data.description as string | undefined;
    banner.imageUrl = data.imageUrl as string;
    banner.linkUrl = data.linkUrl as string | undefined;
    banner.position = data.position as string;
    banner.priority = data.priority as number;
    banner.targetPages = data.targetPages as string[];
    banner.targetUserType = data.targetUserType as string | undefined;
    banner.startDate = data.startDate as Date | undefined;
    banner.endDate = data.endDate as Date | undefined;
    banner.isActive = data.isActive as boolean;
    banner.impressions = data.impressions as number;
    banner.clicks = data.clicks as number;
    banner.createdAt = data.createdAt as Date;
    banner.createdBy = data.createdBy as string | undefined;
    banner.updatedAt = data.updatedAt as Date;

    return banner;
  }
}
