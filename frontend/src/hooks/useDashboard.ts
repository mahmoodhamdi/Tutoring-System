import { useQuery } from '@tanstack/react-query';
import { dashboardApi, DashboardFilters } from '@/lib/api/dashboard';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (filters?: DashboardFilters) => [...dashboardKeys.all, 'stats', filters] as const,
  quickStats: () => [...dashboardKeys.all, 'quick-stats'] as const,
  recentActivities: (limit?: number) => [...dashboardKeys.all, 'recent-activities', limit] as const,
};

// Main dashboard statistics
export function useDashboardStats(filters?: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.stats(filters),
    queryFn: () => dashboardApi.getStats(filters),
  });
}

// Quick stats for header/widgets
export function useQuickStats() {
  return useQuery({
    queryKey: dashboardKeys.quickStats(),
    queryFn: () => dashboardApi.getQuickStats(),
    refetchInterval: 60000, // Refetch every minute
  });
}

// Recent activities
export function useRecentActivities(limit: number = 10) {
  return useQuery({
    queryKey: dashboardKeys.recentActivities(limit),
    queryFn: () => dashboardApi.getRecentActivities(limit),
  });
}
