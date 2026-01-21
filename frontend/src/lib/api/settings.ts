import { apiClient } from './client';
import type {
  Setting,
  SettingsResponse,
  SettingsGrouped,
  SettingUpdatePayload,
  BulkUpdatePayload,
} from '@/types/setting';

export const settingsApi = {
  // Get all settings grouped
  getAll: async (): Promise<SettingsResponse> => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  // Get public settings (no auth required)
  getPublic: async (): Promise<{ data: Setting[] }> => {
    const response = await apiClient.get('/settings/public');
    return response.data;
  },

  // Get a single setting by key
  getByKey: async (key: string): Promise<Setting> => {
    const response = await apiClient.get(`/settings/${key}`);
    return response.data.data;
  },

  // Get settings by group
  getByGroup: async (group: string): Promise<{ data: Setting[]; group: string }> => {
    const response = await apiClient.get(`/settings/group/${group}`);
    return response.data;
  },

  // Update a single setting
  update: async (key: string, value: any): Promise<Setting> => {
    const response = await apiClient.put(`/settings/${key}`, { value });
    return response.data.data;
  },

  // Bulk update settings
  bulkUpdate: async (settings: SettingUpdatePayload[]): Promise<SettingsGrouped> => {
    const response = await apiClient.put('/settings', { settings });
    return response.data.data;
  },

  // Clear settings cache
  clearCache: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/settings/clear-cache');
    return response.data;
  },
};
