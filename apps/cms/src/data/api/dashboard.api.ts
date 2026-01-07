import { API_ROUTES } from "@/domain/constants/api-routes";
import type { DashboardStats } from "@/domain/entities/dashboard.entity";
import { apiClient } from "./api-client";

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    return await apiClient.get<DashboardStats>(API_ROUTES.DASHBOARD.STATS);
  },
};
