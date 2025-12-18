import { BaseEntity } from '@/shared/domain/base.entity';
import { CouponType } from '@prisma/client';
import { Expose } from 'class-transformer';

export class Coupon extends BaseEntity {
  @Expose()
  code!: string;

  @Expose()
  type!: CouponType;

  @Expose()
  value!: number;

  @Expose()
  minOrderAmount?: number;

  @Expose()
  maxDiscount?: number;

  @Expose()
  usageLimit?: number;

  @Expose()
  usageCount!: number;

  @Expose()
  perUserLimit?: number;

  @Expose()
  startDate!: Date;

  @Expose()
  endDate!: Date;

  @Expose()
  isActive!: boolean;

  static toDomain(input: unknown): Coupon | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const coupon = new Coupon();
    coupon.id = data.id as string;
    coupon.code = data.code as string;
    coupon.type = data.type as CouponType;
    coupon.value = Number(data.value);
    coupon.minOrderAmount = data.minOrderAmount
      ? Number(data.minOrderAmount)
      : undefined;
    coupon.maxDiscount = data.maxDiscount
      ? Number(data.maxDiscount)
      : undefined;
    coupon.usageLimit = data.usageLimit as number | undefined;
    coupon.usageCount = Number(data.usageCount);
    coupon.perUserLimit = data.perUserLimit as number | undefined;
    coupon.startDate = data.startDate as Date;
    coupon.endDate = data.endDate as Date;
    coupon.isActive = data.isActive as boolean;
    coupon.createdAt = data.createdAt as Date;
    coupon.updatedAt = data.updatedAt as Date;

    return coupon;
  }
}
