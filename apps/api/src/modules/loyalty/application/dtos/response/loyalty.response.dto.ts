import { Expose } from 'class-transformer';

export class LoyaltyTransactionResponseDto {
  @Expose()
  id!: string;

  @Expose()
  userId!: string;

  @Expose()
  type!: string;

  @Expose()
  points!: number;

  @Expose()
  description!: string;

  @Expose()
  orderId?: string;

  @Expose()
  metadata?: Record<string, unknown>;

  @Expose()
  createdAt!: Date;
}

export class BalanceResponseDto {
  @Expose()
  balance!: number;

  @Expose()
  totalEarned!: number;

  @Expose()
  totalRedeemed!: number;
}

export class RedeemResultDto {
  @Expose()
  discountAmount!: number;

  @Expose()
  pointsRedeemed!: number;

  @Expose()
  newBalance!: number;
}
