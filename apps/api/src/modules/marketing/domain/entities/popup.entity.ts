import { Expose } from 'class-transformer';
import { BaseEntity } from '@/shared/domain/base.entity';

export class Popup extends BaseEntity {

  @Expose()
  name!: string;

  @Expose()
  title!: string;

  @Expose()
  content!: string;

  @Expose()
  imageUrl?: string;

  @Expose()
  triggerType!: string;

  @Expose()
  triggerValue?: number;

  @Expose()
  displayPages!: string[];

  @Expose()
  displayFrequency!: string;

  @Expose()
  targetUserType?: string;

  @Expose()
  ctaText?: string;

  @Expose()
  ctaUrl?: string;

  @Expose()
  variant?: string;

  @Expose()
  startDate?: Date;

  @Expose()
  endDate?: Date;

  @Expose()
  isActive!: boolean;

  @Expose()
  impressions!: number;

  @Expose()
  interactions!: number;

  @Expose()
  conversions!: number;




  static toDomain(input: unknown): Popup | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const popup = new Popup();
    popup.id = data.id as string;
    popup.name = data.name as string;
    popup.title = data.title as string;
    popup.content = data.content as string;
    popup.imageUrl = data.imageUrl as string | undefined;
    popup.triggerType = data.triggerType as string;
    popup.triggerValue = data.triggerValue as number | undefined;
    popup.displayPages = data.displayPages as string[];
    popup.displayFrequency = data.displayFrequency as string;
    popup.targetUserType = data.targetUserType as string | undefined;
    popup.ctaText = data.ctaText as string | undefined;
    popup.ctaUrl = data.ctaUrl as string | undefined;
    popup.variant = data.variant as string | undefined;
    popup.startDate = data.startDate as Date | undefined;
    popup.endDate = data.endDate as Date | undefined;
    popup.isActive = data.isActive as boolean;
    popup.impressions = data.impressions as number;
    popup.interactions = data.interactions as number;
    popup.conversions = data.conversions as number;
    popup.createdAt = data.createdAt as Date;
    popup.createdBy = data.createdBy as string | undefined;
    popup.updatedAt = data.updatedAt as Date;

    return popup;
  }
}
