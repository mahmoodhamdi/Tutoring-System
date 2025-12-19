import { apiClient, PaginatedResponse } from './client';
import type {
  Announcement,
  CreateAnnouncementData,
  UpdateAnnouncementData,
  AnnouncementsFilters,
  AnnouncementStatistics,
} from '@/types/announcement';

export const announcementsApi = {
  // CRUD
  getAll: async (filters?: AnnouncementsFilters): Promise<PaginatedResponse<Announcement>> => {
    const params = new URLSearchParams();
    if (filters?.group_id) params.append('group_id', String(filters.group_id));
    if (filters?.is_published !== undefined) params.append('is_published', String(filters.is_published));
    if (filters?.active_only) params.append('active_only', '1');
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.is_pinned !== undefined) params.append('is_pinned', String(filters.is_pinned));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.per_page) params.append('per_page', String(filters.per_page));
    if (filters?.page) params.append('page', String(filters.page));

    const response = await apiClient.get(`/announcements?${params.toString()}`);
    return response.data;
  },

  getRecent: async (limit: number = 5): Promise<Announcement[]> => {
    const response = await apiClient.get(`/announcements/recent?limit=${limit}`);
    return response.data.data;
  },

  getUnread: async (): Promise<Announcement[]> => {
    const response = await apiClient.get('/announcements/unread');
    return response.data.data;
  },

  getById: async (id: number): Promise<Announcement> => {
    const response = await apiClient.get(`/announcements/${id}`);
    return response.data.data;
  },

  create: async (data: CreateAnnouncementData): Promise<Announcement> => {
    const response = await apiClient.post('/announcements', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateAnnouncementData): Promise<Announcement> => {
    const response = await apiClient.put(`/announcements/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/announcements/${id}`);
  },

  // Publishing
  publish: async (id: number): Promise<Announcement> => {
    const response = await apiClient.post(`/announcements/${id}/publish`);
    return response.data.data;
  },

  unpublish: async (id: number): Promise<Announcement> => {
    const response = await apiClient.post(`/announcements/${id}/unpublish`);
    return response.data.data;
  },

  // Pinning
  pin: async (id: number): Promise<Announcement> => {
    const response = await apiClient.post(`/announcements/${id}/pin`);
    return response.data.data;
  },

  unpin: async (id: number): Promise<Announcement> => {
    const response = await apiClient.post(`/announcements/${id}/unpin`);
    return response.data.data;
  },

  // Reading
  markAsRead: async (id: number): Promise<void> => {
    await apiClient.post(`/announcements/${id}/read`);
  },

  markAllAsRead: async (): Promise<{ count: number }> => {
    const response = await apiClient.post('/announcements/mark-all-read');
    return response.data;
  },

  // Statistics
  getStatistics: async (): Promise<AnnouncementStatistics> => {
    const response = await apiClient.get('/announcements/statistics');
    return response.data.data;
  },
};
