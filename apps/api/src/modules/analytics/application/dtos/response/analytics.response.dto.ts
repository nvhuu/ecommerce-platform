import { Expose, Type } from 'class-transformer';

export class ProductViewStatsDto {
  @Expose()
  productId!: string;

  @Expose()
  totalViews!: number;

  @Expose()
  uniqueUsers!: number;

  @Expose()
  @Type(() => ViewByDayDto)
  viewsByDay!: ViewByDayDto[];
}

export class ViewByDayDto {
  @Expose()
  date!: string;

  @Expose()
  count!: number;
}

export class SearchStatsDto {
  @Expose()
  totalSearches!: number;

  @Expose()
  uniqueQueries!: number;

  @Expose()
  avgResultsCount!: number;

  @Expose()
  @Type(() => TopQueryDto)
  topQueries!: TopQueryDto[];

  @Expose()
  noResultQueries!: string[];
}

export class TopQueryDto {
  @Expose()
  query!: string;

  @Expose()
  count!: number;
}

export class CheckoutFunnelDto {
  @Expose()
  cartView!: number;

  @Expose()
  shippingInfo!: number;

  @Expose()
  paymentInfo!: number;

  @Expose()
  orderReview!: number;

  @Expose()
  orderComplete!: number;

  @Expose()
  conversionRate!: number;
}

export class CartItemDto {
  @Expose()
  productId!: string;

  @Expose()
  name!: string;

  @Expose()
  price!: number;

  @Expose()
  quantity!: number;

  @Expose()
  image?: string;
}

export class CartAbandonmentDto {
  @Expose()
  id!: string;

  @Expose()
  userId?: string;

  @Expose()
  sessionId!: string;

  @Expose()
  email?: string;

  @Expose()
  @Type(() => CartItemDto)
  cartItems!: CartItemDto[];

  @Expose()
  cartTotal!: number;

  @Expose()
  status!: string;

  @Expose()
  recoveryEmailsSent!: number;

  @Expose()
  lastEmailSentAt?: Date;

  @Expose()
  recoveredAt?: Date;

  @Expose()
  expiredAt?: Date;

  @Expose()
  abandonedAt!: Date;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
