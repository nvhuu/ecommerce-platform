import { Expose } from 'class-transformer';

export class DashboardStatsResponseDto {
  @Expose()
  totalUsers!: number;

  @Expose()
  totalProducts!: number;

  @Expose()
  totalCategories!: number;

  @Expose()
  totalOrders!: number;

  @Expose()
  totalRevenue!: number;

  @Expose()
  pendingOrders!: number;

  @Expose()
  completedOrders!: number;
}
