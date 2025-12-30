import { MESSAGES } from '@/shared/constants/messages.constant';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoyaltyTransactionType } from '../../domain/entities/loyalty-transaction.entity';
import { ILoyaltyRepository } from '../../domain/repositories/loyalty.repository.interface';

@Injectable()
export class LoyaltyService {
  // Configuration constants (1 point per 10,000 VND, 1 point = 1,000 VND)
  private readonly POINTS_PER_VND = 0.0001; // 1 point per 10,000 VND
  private readonly VND_PER_POINT = 1000; // 1 point = 1,000 VND

  constructor(
    @Inject('ILoyaltyRepository')
    private readonly loyaltyRepository: ILoyaltyRepository,
  ) {}

  /**.
   * Award points to user when order is completed
   */
  async earnPoints(
    userId: string,
    orderId: string,
    orderValue: number,
  ): Promise<void> {
    const points = this.calculatePointsForOrder(orderValue);

    if (points <= 0) return;

    await this.loyaltyRepository.createTransaction({
      userId,
      type: LoyaltyTransactionType.EARN,
      points,
      description: `Earned ${points} points from order`,
      orderId,
      metadata: {
        orderValue,
        rate: this.POINTS_PER_VND,
      },
    });
  }

  /**
   * Redeem points for discount
   */
  async redeemPoints(
    userId: string,
    points: number,
    orderId?: string,
  ): Promise<{ discountAmount: number; newBalance: number }> {
    if (points <= 0) {
      throw new BadRequestException('Points must be greater than 0');
    }

    const currentBalance = await this.loyaltyRepository.getUserBalance(userId);

    if (currentBalance < points) {
      throw new BadRequestException(MESSAGES.LOYALTY.INSUFFICIENT_POINTS);
    }

    const discountAmount = this.calculateDiscountFromPoints(points);

    await this.loyaltyRepository.createTransaction({
      userId,
      type: LoyaltyTransactionType.REDEEM,
      points: -points, // Negative for redemption
      description: `Redeemed ${points} points for ${discountAmount} VND discount`,
      orderId,
      metadata: {
        discountAmount,
        rate: this.VND_PER_POINT,
      },
    });

    const newBalance = currentBalance - points;

    return { discountAmount, newBalance };
  }

  /**
   * Get user's current loyalty points balance
   */
  async getBalance(userId: string): Promise<number> {
    return await this.loyaltyRepository.getUserBalance(userId);
  }

  /**
   * Get user's transaction history with pagination
   */
  async getTransactionHistory(userId: string, page?: number, limit?: number) {
    return await this.loyaltyRepository.findByUserId(userId, {
      page,
      limit,
      sortOrder: 'desc',
    });
  }

  /**
   * Admin: Manually adjust user's points
   */
  async adjustPoints(
    userId: string,
    points: number,
    description: string,
    adminId: string,
  ): Promise<void> {
    await this.loyaltyRepository.createTransaction({
      userId,
      type: LoyaltyTransactionType.ADJUST,
      points,
      description,
      createdBy: adminId,
      metadata: {
        adjustedBy: adminId,
      },
    });
  }

  /**
   * Calculate points earned from order value
   */
  calculatePointsForOrder(orderValue: number): number {
    return Math.floor(orderValue * this.POINTS_PER_VND);
  }

  /**
   * Calculate discount amount from points
   */
  calculateDiscountFromPoints(points: number): number {
    return points * this.VND_PER_POINT;
  }

  /**
   * Reverse points for cancelled/returned orders
   */
  async reversePointsForOrder(orderId: string): Promise<void> {
    // Find all transactions for this order
    const transactions = await this.loyaltyRepository.findByOrderId(orderId);

    // Reverse EARN transactions
    for (const transaction of transactions) {
      if (
        transaction.type === LoyaltyTransactionType.EARN &&
        transaction.points > 0
      ) {
        await this.loyaltyRepository.createTransaction({
          userId: transaction.userId,
          type: LoyaltyTransactionType.ADJUST,
          points: -transaction.points,
          description: `Points reversed for returned/cancelled order`,
          orderId,
          metadata: {
            originalTransactionId: transaction.id,
            reason: 'Order return/cancellation',
          },
        });
      }
    }
  }
}
