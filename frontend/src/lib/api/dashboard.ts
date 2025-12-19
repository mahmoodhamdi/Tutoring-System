import api from './axios';
import type { DashboardData, QuickStats, RecentActivity } from '@/types/dashboard';

export interface DashboardFilters {
  start_date?: string;
  end_date?: string;
}

export const dashboardApi = {
  // Get main dashboard statistics
  getStats: async (filters?: DashboardFilters): Promise<DashboardData> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await api.get(`/dashboard?${params.toString()}`);
    return response.data;
  },

  // Get quick stats for header/widgets
  getQuickStats: async (): Promise<QuickStats> => {
    const response = await api.get('/dashboard/quick-stats');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit: number = 10): Promise<RecentActivity[]> => {
    const response = await api.get(`/dashboard/recent-activities?limit=${limit}`);
    return response.data;
  },
};
