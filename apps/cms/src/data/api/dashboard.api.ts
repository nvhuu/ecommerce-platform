import { API_ROUTES } from "@/domain/constants/api-routes";
import type { DashboardStats } from "@/domain/entities/dashboard.entity";
import { getApi } from "./api-client";

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await getApi<DashboardStats>(API_ROUTES.DASHBOARD.STATS);
    return response.data;
  },
};
