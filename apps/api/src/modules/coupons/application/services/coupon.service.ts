import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CouponType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ICouponRepository } from '../../domain/repositories/coupon.repository.interface';
import {
  CouponResponseDto,
  CouponValidationResultDto,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
} from '../dtos/coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @Inject('ICouponRepository')
    private readonly repository: ICouponRepository,
  ) {}

  async createCoupon(
    dto: CreateCouponDto,
    userId?: string,
  ): Promise<CouponResponseDto> {
    // Check if code already exists
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException(MESSAGES.COUPON.CODE_EXISTS);
    }

    // Validate dates
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException(MESSAGES.COUPON.INVALID_DATE_RANGE);
    }

    const coupon = await this.repository.create({
      ...dto,
      startDate,
      endDate,
      createdBy: userId,
    });

    return plainToInstance(CouponResponseDto, coupon);
  }

  async getCoupons(
    page = 1,
    limit = 10,
  ): Promise<{ data: CouponResponseDto[]; total: number }> {
    const result = await this.repository.findAll(page, limit);
    return {
      data: plainToInstance(CouponResponseDto, result.data),
      total: result.total,
    };
  }

  async getCoupon(id: string): Promise<CouponResponseDto> {
    const coupon = await this.repository.findById(id);
    if (!coupon) {
      throw new NotFoundException(MESSAGES.COUPON.NOT_FOUND);
    }
    return plainToInstance(CouponResponseDto, coupon);
  }

  async updateCoupon(
    id: string,
    dto: UpdateCouponDto,
  ): Promise<CouponResponseDto> {
    const coupon = await this.repository.findById(id);
    if (!coupon) {
      throw new NotFoundException(MESSAGES.COUPON.NOT_FOUND);
    }

    const updated = await this.repository.update(id, {
      ...dto,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });

    return plainToInstance(CouponResponseDto, updated);
  }

  async deleteCoupon(id: string): Promise<void> {
    const coupon = await this.repository.findById(id);
    if (!coupon) {
      throw new NotFoundException(MESSAGES.COUPON.NOT_FOUND);
    }
    await this.repository.delete(id);
  }

  /**
   * Validate coupon and calculate discount
   * Core business logic for coupon validation
   */
  async validateCoupon(
    dto: ValidateCouponDto,
  ): Promise<CouponValidationResultDto> {
    const coupon = await this.repository.findByCode(dto.code);

    if (!coupon) {
      return {
        valid: false,
        message: MESSAGES.COUPON.NOT_FOUND,
      };
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return {
        valid: false,
        message: MESSAGES.COUPON.NOT_ACTIVE,
      };
    }

    // Check date range
    const now = new Date();
    if (now < coupon.startDate) {
      return {
        valid: false,
        message: MESSAGES.COUPON.NOT_YET_VALID,
      };
    }

    if (now > coupon.endDate) {
      return {
        valid: false,
        message: MESSAGES.COUPON.EXPIRED,
      };
    }

    // Check total usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return {
        valid: false,
        message: MESSAGES.COUPON.USAGE_LIMIT_REACHED,
      };
    }

    // Check per-user limit
    if (coupon.perUserLimit) {
      const userUsageCount = await this.repository.getUserUsageCount(
        coupon.id,
        dto.userId,
      );
      if (userUsageCount >= coupon.perUserLimit) {
        return {
          valid: false,
          message: MESSAGES.COUPON.USER_LIMIT_REACHED,
        };
      }
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && dto.orderTotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: MESSAGES.COUPON.MIN_ORDER_NOT_MET,
      };
    }

    // Calculate discount
    const discountAmount = this.calculateDiscount(
      coupon.type,
      coupon.value,
      dto.orderTotal,
      coupon.maxDiscount,
    );

    return {
      valid: true,
      discountAmount,
    };
  }

  /**
   * Calculate discount amount based on coupon type
   */
  private calculateDiscount(
    type: CouponType,
    value: number,
    orderTotal: number,
    maxDiscount?: number,
  ): number {
    let discount = 0;

    switch (type) {
      case 'PERCENTAGE':
        discount = (orderTotal * value) / 100;
        if (maxDiscount) {
          discount = Math.min(discount, maxDiscount);
        }
        break;

      case 'FIXED_AMOUNT':
        discount = Math.min(value, orderTotal);
        break;

      case 'FREE_SHIPPING':
        // Shipping fee should be handled separately
        // This returns 0 as discount, shipping fee will be set to 0 in order service
        discount = 0;
        break;
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Apply coupon to order (increment usage count)
   */
  async applyCoupon(couponId: string): Promise<void> {
    await this.repository.incrementUsageCount(couponId);
  }
}
