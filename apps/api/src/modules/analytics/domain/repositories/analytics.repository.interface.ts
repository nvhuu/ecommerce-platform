import {
  AbandonmentStatus,
  CartAbandonment,
} from '../entities/cart-abandonment.entity';
import { CheckoutStep } from '../entities/checkout-step.entity';
import { ProductView } from '../entities/product-view.entity';
import { SearchLog } from '../entities/search-log.entity';

export interface ProductViewStats {
  productId: string;
  totalViews: number;
  uniqueUsers: number;
  viewsByDay: Array<{ date: string; count: number }>;
}

export interface SearchStats {
  totalSearches: number;
  uniqueQueries: number;
  avgResultsCount: number;
  topQueries: Array<{ query: string; count: number }>;
  noResultQueries: string[];
}

export interface CheckoutFunnelStats {
  cartView: number;
  shippingInfo: number;
  paymentInfo: number;
  orderReview: number;
  orderComplete: number;
  conversionRate: number;
}

export interface IAnalyticsRepository {
  // Tracking methods
  trackProductView(data: Partial<ProductView>): Promise<ProductView>;
  trackSearch(data: Partial<SearchLog>): Promise<SearchLog>;
  trackCheckoutStep(data: Partial<CheckoutStep>): Promise<CheckoutStep>;
  trackCartAbandonment(
    data: Partial<CartAbandonment>,
  ): Promise<CartAbandonment>;

  // Analytics queries
  getProductViewStats(
    productId: string,
    days: number,
  ): Promise<ProductViewStats>;
  getSearchStats(days: number): Promise<SearchStats>;
  getCheckoutFunnel(days: number): Promise<CheckoutFunnelStats>;

  // Cart abandonment queries
  getAbandonedCarts(status: AbandonmentStatus): Promise<CartAbandonment[]>;
  getAbandonedCartsForRecovery(
    hoursAgo: number,
    maxEmailsSent: number,
  ): Promise<CartAbandonment[]>;
  updateCartAbandonment(
    id: string,
    data: Partial<CartAbandonment>,
  ): Promise<CartAbandonment>;
  markCartRecovered(id: string): Promise<void>;
}
