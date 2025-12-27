import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { Coupon } from '../../domain/entities/coupon.entity';
import { ICouponRepository } from '../../domain/repositories/coupon.repository.interface';

@Injectable()
export class CouponRepository implements ICouponRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(coupon: Partial<Coupon>): Promise<Coupon> {
    const created = await this.prisma.coupon.create({
      data: {
        code: coupon.code!,
        type: coupon.type!,
        value: coupon.value!,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
        usageLimit: coupon.usageLimit,
        perUserLimit: coupon.perUserLimit,
        startDate: coupon.startDate!,
        endDate: coupon.endDate!,
        isActive: coupon.isActive ?? true,
        createdBy: coupon.createdBy,
      },
    });

    const result = Coupon.toDomain(created);
    if (!result) throw new Error('Failed to create coupon');
    return result;
  }

  async findById(id: string): Promise<Coupon | null> {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    return coupon ? Coupon.toDomain(coupon) : null;
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    return coupon ? Coupon.toDomain(coupon) : null;
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Coupon[]; total: number }> {
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: SortOrder.DESC },
      }),
      this.prisma.coupon.count(),
    ]);

    return {
      data: coupons
        .map((c) => Coupon.toDomain(c))
        .filter((c): c is Coupon => c !== null),
      total,
    };
  }

  async update(id: string, coupon: Partial<Coupon>): Promise<Coupon> {
    const updated = await this.prisma.coupon.update({
      where: { id },
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
        usageLimit: coupon.usageLimit,
        perUserLimit: coupon.perUserLimit,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        isActive: coupon.isActive,
      },
    });

    const result = Coupon.toDomain(updated);
    if (!result) throw new Error('Failed to update coupon');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.coupon.delete({ where: { id } });
  }

  async incrementUsageCount(id: string): Promise<Coupon> {
    const updated = await this.prisma.coupon.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });

    const result = Coupon.toDomain(updated);
    if (!result) throw new Error('Failed to increment usage');
    return result;
  }

  async getUserUsageCount(couponId: string, userId: string): Promise<number> {
    return this.prisma.couponUsage.count({
      where: { couponId, userId },
    });
  }
}
