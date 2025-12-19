import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/notifications';
import type { NotificationsFilters, NotificationPreferences } from '@/types/notification';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: NotificationsFilters) => [...notificationKeys.lists(), filters] as const,
  recent: (limit?: number) => [...notificationKeys.all, 'recent', limit] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: number) => [...notificationKeys.details(), id] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

// Notifications list
export function useNotifications(filters?: NotificationsFilters) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationsApi.getAll(filters),
  });
}

// Unread count
export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// Recent notifications
export function useRecentNotifications(limit: number = 5) {
  return useQuery({
    queryKey: notificationKeys.recent(limit),
    queryFn: () => notificationsApi.getRecent(limit),
  });
}

// Single notification
export function useNotification(id: number) {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => notificationsApi.getById(id),
    enabled: !!id,
  });
}

// Preferences
export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationsApi.getPreferences(),
  });
}

// Mark as read
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.recent() });
    },
  });
}

// Mark as unread
export function useMarkNotificationAsUnread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationsApi.markAsUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.recent() });
    },
  });
}

// Mark all as read
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.recent() });
    },
  });
}

// Delete notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.recent() });
    },
  });
}

// Delete read notifications
export function useDeleteReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.deleteRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
}

// Update preferences
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      notificationsApi.updatePreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
    },
  });
}

// Send test notification
export function useSendTestNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.sendTest(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.recent() });
    },
  });
}
