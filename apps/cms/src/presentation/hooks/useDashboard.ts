import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/data/api/dashboard.api";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  stats: () => [...DASHBOARD_KEYS.all, "stats"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats(),
    queryFn: () => dashboardApi.getStats(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}
