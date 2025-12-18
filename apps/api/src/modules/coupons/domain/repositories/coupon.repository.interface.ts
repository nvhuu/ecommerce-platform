import { Coupon } from '../entities/coupon.entity';

export interface ICouponRepository {
  create(coupon: Partial<Coupon>): Promise<Coupon>;
  findById(id: string): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  findAll(
    page?: number,
    limit?: number,
  ): Promise<{ data: Coupon[]; total: number }>;
  update(id: string, coupon: Partial<Coupon>): Promise<Coupon>;
  delete(id: string): Promise<void>;
  incrementUsageCount(id: string): Promise<Coupon>;
  getUserUsageCount(couponId: string, userId: string): Promise<number>;
}
