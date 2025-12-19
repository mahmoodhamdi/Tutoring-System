import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupsApi } from '@/lib/api/groups';
import {
  Group,
  GroupListParams,
  GroupFormData,
  AddStudentsData,
  GroupStudentListParams,
} from '@/types/group';
import { toast } from 'react-hot-toast';

export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  list: (params: GroupListParams) => [...groupKeys.lists(), params] as const,
  details: () => [...groupKeys.all, 'detail'] as const,
  detail: (id: number) => [...groupKeys.details(), id] as const,
  students: (id: number, params?: GroupStudentListParams) =>
    [...groupKeys.detail(id), 'students', params] as const,
  sessions: (id: number) => [...groupKeys.detail(id), 'sessions'] as const,
};

export function useGroups(params: GroupListParams = {}) {
  return useQuery({
    queryKey: groupKeys.list(params),
    queryFn: () => groupsApi.list(params),
  });
}

export function useGroup(id: number) {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => groupsApi.get(id),
    enabled: !!id,
  });
}

export function useGroupStudents(groupId: number, params: GroupStudentListParams = {}) {
  return useQuery({
    queryKey: groupKeys.students(groupId, params),
    queryFn: () => groupsApi.getStudents(groupId, params),
    enabled: !!groupId,
  });
}

export function useGroupSessions(groupId: number) {
  return useQuery({
    queryKey: groupKeys.sessions(groupId),
    queryFn: () => groupsApi.getSessions(groupId),
    enabled: !!groupId,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GroupFormData) => groupsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      toast.success('تم إنشاء المجموعة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إنشاء المجموعة');
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<GroupFormData> }) =>
      groupsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.id) });
      toast.success('تم تحديث المجموعة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث المجموعة');
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => groupsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      toast.success('تم حذف المجموعة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف المجموعة');
    },
  });
}

export function useAddStudentsToGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: number; data: AddStudentsData }) =>
      groupsApi.addStudents(groupId, data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.students(variables.groupId) });
      toast.success(`تمت إضافة ${result.added_count} طالب بنجاح`);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إضافة الطلاب');
    },
  });
}

export function useRemoveStudentFromGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, studentId }: { groupId: number; studentId: number }) =>
      groupsApi.removeStudent(groupId, studentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.students(variables.groupId) });
      toast.success('تم إزالة الطالب من المجموعة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إزالة الطالب');
    },
  });
}
