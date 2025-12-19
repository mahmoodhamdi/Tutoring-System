'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '@/lib/api/students';
import {
  StudentListParams,
  CreateStudentData,
  UpdateStudentData,
} from '@/types/student';
import toast from 'react-hot-toast';

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params: StudentListParams) => [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: number) => [...studentKeys.details(), id] as const,
  attendance: (id: number) => [...studentKeys.detail(id), 'attendance'] as const,
  payments: (id: number) => [...studentKeys.detail(id), 'payments'] as const,
  grades: (id: number) => [...studentKeys.detail(id), 'grades'] as const,
};

export function useStudents(params: StudentListParams = {}) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => studentsApi.list(params),
  });
}

export function useStudent(id: number) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentData) => studentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success('تم إضافة الطالب بنجاح');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'حدث خطأ أثناء إضافة الطالب';
      toast.error(message);
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentData }) =>
      studentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: studentKeys.detail(variables.id),
      });
      toast.success('تم تحديث بيانات الطالب بنجاح');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'حدث خطأ أثناء تحديث البيانات';
      toast.error(message);
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => studentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success('تم حذف الطالب بنجاح');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'حدث خطأ أثناء حذف الطالب';
      toast.error(message);
    },
  });
}

export function useStudentAttendance(
  id: number,
  params?: {
    page?: number;
    per_page?: number;
    from?: string;
    to?: string;
    status?: string;
  }
) {
  return useQuery({
    queryKey: [...studentKeys.attendance(id), params],
    queryFn: () => studentsApi.getAttendance(id, params),
    enabled: !!id,
  });
}

export function useStudentPayments(
  id: number,
  params?: {
    page?: number;
    per_page?: number;
    from?: string;
    to?: string;
    status?: string;
  }
) {
  return useQuery({
    queryKey: [...studentKeys.payments(id), params],
    queryFn: () => studentsApi.getPayments(id, params),
    enabled: !!id,
  });
}

export function useStudentGrades(
  id: number,
  params?: {
    page?: number;
    per_page?: number;
    from?: string;
    to?: string;
  }
) {
  return useQuery({
    queryKey: [...studentKeys.grades(id), params],
    queryFn: () => studentsApi.getGrades(id, params),
    enabled: !!id,
  });
}
