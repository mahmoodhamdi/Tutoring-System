import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sessionsApi } from '@/lib/api/sessions';
import { SessionListParams, SessionFormData, CancelSessionData } from '@/types/session';
import { toast } from 'react-hot-toast';

export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (params: SessionListParams) => [...sessionKeys.lists(), params] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: number) => [...sessionKeys.details(), id] as const,
  today: () => [...sessionKeys.all, 'today'] as const,
  week: () => [...sessionKeys.all, 'week'] as const,
  upcoming: (limit?: number) => [...sessionKeys.all, 'upcoming', limit] as const,
};

export function useSessions(params: SessionListParams = {}) {
  return useQuery({
    queryKey: sessionKeys.list(params),
    queryFn: () => sessionsApi.list(params),
  });
}

export function useSession(id: number) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionsApi.get(id),
    enabled: !!id,
  });
}

export function useTodaySessions() {
  return useQuery({
    queryKey: sessionKeys.today(),
    queryFn: () => sessionsApi.today(),
  });
}

export function useWeekSessions() {
  return useQuery({
    queryKey: sessionKeys.week(),
    queryFn: () => sessionsApi.week(),
  });
}

export function useUpcomingSessions(limit = 10) {
  return useQuery({
    queryKey: sessionKeys.upcoming(limit),
    queryFn: () => sessionsApi.upcoming(limit),
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SessionFormData) => sessionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.today() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.week() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.upcoming() });
      toast.success('تم إنشاء الجلسة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إنشاء الجلسة');
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SessionFormData> }) =>
      sessionsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.id) });
      toast.success('تم تحديث الجلسة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث الجلسة');
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success('تم حذف الجلسة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف الجلسة');
    },
  });
}

export function useCancelSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CancelSessionData }) =>
      sessionsApi.cancel(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.id) });
      toast.success('تم إلغاء الجلسة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إلغاء الجلسة');
    },
  });
}

export function useCompleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionsApi.complete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) });
      toast.success('تم إكمال الجلسة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إكمال الجلسة');
    },
  });
}
