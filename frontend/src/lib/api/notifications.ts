import { apiClient, PaginatedResponse } from './client';
import type {
  Notification,
  NotificationsFilters,
  NotificationPreferences,
} from '@/types/notification';

export const notificationsApi = {
  // List notifications
  getAll: async (filters?: NotificationsFilters): Promise<PaginatedResponse<Notification>> => {
    const params = new URLSearchParams();
    if (filters?.is_read !== undefined) params.append('is_read', String(filters.is_read));
    if (filters?.type) params.append('type', filters.type);
    if (filters?.days) params.append('days', String(filters.days));
    if (filters?.per_page) params.append('per_page', String(filters.per_page));
    if (filters?.page) params.append('page', String(filters.page));

    const response = await apiClient.get(`/notifications?${params.toString()}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.data.count;
  },

  // Get recent notifications
  getRecent: async (limit: number = 5): Promise<Notification[]> => {
    const response = await apiClient.get(`/notifications/recent?limit=${limit}`);
    return response.data.data;
  },

  // Get single notification
  getById: async (id: number): Promise<Notification> => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data.data;
  },

  // Mark as read
  markAsRead: async (id: number): Promise<Notification> => {
    const response = await apiClient.post(`/notifications/${id}/read`);
    return response.data.data;
  },

  // Mark as unread
  markAsUnread: async (id: number): Promise<Notification> => {
    const response = await apiClient.post(`/notifications/${id}/unread`);
    return response.data.data;
  },

  // Mark all as read
  markAllAsRead: async (): Promise<{ count: number }> => {
    const response = await apiClient.post('/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },

  // Delete all read notifications
  deleteRead: async (): Promise<{ count: number }> => {
    const response = await apiClient.delete('/notifications/read');
    return response.data;
  },

  // Get preferences
  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await apiClient.get('/notifications/preferences');
    return response.data.data;
  },

  // Update preferences
  updatePreferences: async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    const response = await apiClient.put('/notifications/preferences', preferences);
    return response.data.data;
  },

  // Send test notification
  sendTest: async (): Promise<Notification> => {
    const response = await apiClient.post('/notifications/test');
    return response.data.data;
  },
};
