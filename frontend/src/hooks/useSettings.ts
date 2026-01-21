import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api/settings';
import type { SettingUpdatePayload } from '@/types/setting';

export const settingKeys = {
  all: ['settings'] as const,
  grouped: () => [...settingKeys.all, 'grouped'] as const,
  public: () => [...settingKeys.all, 'public'] as const,
  byGroup: (group: string) => [...settingKeys.all, 'group', group] as const,
  byKey: (key: string) => [...settingKeys.all, 'key', key] as const,
};

// Get all settings grouped
export function useSettings() {
  return useQuery({
    queryKey: settingKeys.grouped(),
    queryFn: () => settingsApi.getAll(),
  });
}

// Get public settings
export function usePublicSettings() {
  return useQuery({
    queryKey: settingKeys.public(),
    queryFn: () => settingsApi.getPublic(),
  });
}

// Get settings by group
export function useSettingsByGroup(group: string) {
  return useQuery({
    queryKey: settingKeys.byGroup(group),
    queryFn: () => settingsApi.getByGroup(group),
    enabled: !!group,
  });
}

// Get single setting by key
export function useSetting(key: string) {
  return useQuery({
    queryKey: settingKeys.byKey(key),
    queryFn: () => settingsApi.getByKey(key),
    enabled: !!key,
  });
}

// Update a single setting
export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) =>
      settingsApi.update(key, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: settingKeys.grouped() });
      queryClient.invalidateQueries({ queryKey: settingKeys.byKey(variables.key) });
      queryClient.invalidateQueries({ queryKey: settingKeys.public() });
    },
  });
}

// Bulk update settings
export function useBulkUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: SettingUpdatePayload[]) => settingsApi.bulkUpdate(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
    },
  });
}

// Clear settings cache
export function useClearSettingsCache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => settingsApi.clearCache(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
    },
  });
}
