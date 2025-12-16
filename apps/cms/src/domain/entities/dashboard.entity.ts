export interface DashboardStats {
  totalSales: number;
  salesGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  newCustomers: number;
  customersGrowth: number;
  activeSessions: number;
}

export interface RecentOrder {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  status: string;
  createdAt: string;
}
