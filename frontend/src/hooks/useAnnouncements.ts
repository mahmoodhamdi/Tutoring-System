import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsApi } from '@/lib/api/announcements';
import type {
  Announcement,
  CreateAnnouncementData,
  UpdateAnnouncementData,
  AnnouncementsFilters,
} from '@/types/announcement';

export const announcementKeys = {
  all: ['announcements'] as const,
  lists: () => [...announcementKeys.all, 'list'] as const,
  list: (filters?: AnnouncementsFilters) => [...announcementKeys.lists(), filters] as const,
  recent: (limit?: number) => [...announcementKeys.all, 'recent', limit] as const,
  unread: () => [...announcementKeys.all, 'unread'] as const,
  details: () => [...announcementKeys.all, 'detail'] as const,
  detail: (id: number) => [...announcementKeys.details(), id] as const,
  statistics: () => [...announcementKeys.all, 'statistics'] as const,
};

// Announcements list
export function useAnnouncements(filters?: AnnouncementsFilters) {
  return useQuery({
    queryKey: announcementKeys.list(filters),
    queryFn: () => announcementsApi.getAll(filters),
  });
}

// Recent announcements
export function useRecentAnnouncements(limit: number = 5) {
  return useQuery({
    queryKey: announcementKeys.recent(limit),
    queryFn: () => announcementsApi.getRecent(limit),
  });
}

// Unread announcements
export function useUnreadAnnouncements() {
  return useQuery({
    queryKey: announcementKeys.unread(),
    queryFn: () => announcementsApi.getUnread(),
  });
}

// Single announcement
export function useAnnouncement(id: number) {
  return useQuery({
    queryKey: announcementKeys.detail(id),
    queryFn: () => announcementsApi.getById(id),
    enabled: !!id,
  });
}

// Statistics
export function useAnnouncementStatistics() {
  return useQuery({
    queryKey: announcementKeys.statistics(),
    queryFn: () => announcementsApi.getStatistics(),
  });
}

// Create announcement
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementData) => announcementsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.statistics() });
    },
  });
}

// Update announcement
export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAnnouncementData }) =>
      announcementsApi.update(id, data),
    onSuccess: (announcement) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.setQueryData(announcementKeys.detail(announcement.id), announcement);
    },
  });
}

// Delete announcement
export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => announcementsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.statistics() });
    },
  });
}

// Publish announcement
export function usePublishAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => announcementsApi.publish(id),
    onSuccess: (announcement) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.setQueryData(announcementKeys.detail(announcement.id), announcement);
      queryClient.invalidateQueries({ queryKey: announcementKeys.statistics() });
    },
  });
}

// Unpublish announcement
export function useUnpublishAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => announcementsApi.unpublish(id),
    onSuccess: (announcement) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.setQueryData(announcementKeys.detail(announcement.id), announcement);
      queryClient.invalidateQueries({ queryKey: announcementKeys.statistics() });
    },
  });
}

// Pin announcement
export function usePinAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => announcementsApi.pin(id),
    onSuccess: (announcement) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.setQueryData(announcementKeys.detail(announcement.id), announcement);
    },
  });
}

// Unpin announcement
export function useUnpinAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => announcementsApi.unpin(id),
    onSuccess: (announcement) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.setQueryData(announcementKeys.detail(announcement.id), announcement);
    },
  });
}

// Mark as read
export function useMarkAnnouncementAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => announcementsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.unread() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
}

// Mark all as read
export function useMarkAllAnnouncementsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => announcementsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.unread() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
}
