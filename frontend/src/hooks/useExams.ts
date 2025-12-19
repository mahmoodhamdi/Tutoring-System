import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '@/lib/api/exams';
import { ExamListParams, ExamFormData, ExamResultFormData } from '@/types/exam';
import { toast } from 'react-hot-toast';

export const examKeys = {
  all: ['exams'] as const,
  lists: () => [...examKeys.all, 'list'] as const,
  list: (params: ExamListParams) => [...examKeys.lists(), params] as const,
  details: () => [...examKeys.all, 'detail'] as const,
  detail: (id: number) => [...examKeys.details(), id] as const,
  upcoming: (params?: { group_id?: number }) => [...examKeys.all, 'upcoming', params] as const,
  recent: (params?: { group_id?: number }) => [...examKeys.all, 'recent', params] as const,
  results: (examId: number) => [...examKeys.all, 'results', examId] as const,
  statistics: (examId: number) => [...examKeys.all, 'statistics', examId] as const,
  studentExams: (studentId: number) => [...examKeys.all, 'student', studentId] as const,
};

export function useExams(params: ExamListParams = {}) {
  return useQuery({
    queryKey: examKeys.list(params),
    queryFn: () => examsApi.list(params),
  });
}

export function useExam(id: number) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: () => examsApi.get(id),
    enabled: !!id,
  });
}

export function useUpcomingExams(params: { group_id?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: examKeys.upcoming(params),
    queryFn: () => examsApi.upcoming(params),
  });
}

export function useRecentExams(params: { group_id?: number; days?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: examKeys.recent(params),
    queryFn: () => examsApi.recent(params),
  });
}

export function useExamResults(examId: number) {
  return useQuery({
    queryKey: examKeys.results(examId),
    queryFn: () => examsApi.getResults(examId),
    enabled: !!examId,
  });
}

export function useExamStatistics(examId: number) {
  return useQuery({
    queryKey: examKeys.statistics(examId),
    queryFn: () => examsApi.getStatistics(examId),
    enabled: !!examId,
  });
}

export function useStudentExams(studentId: number) {
  return useQuery({
    queryKey: examKeys.studentExams(studentId),
    queryFn: () => examsApi.getStudentExams(studentId),
    enabled: !!studentId,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExamFormData) => examsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      queryClient.invalidateQueries({ queryKey: examKeys.upcoming() });
      toast.success('تم إنشاء الاختبار بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إنشاء الاختبار');
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ExamFormData> }) =>
      examsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      queryClient.invalidateQueries({ queryKey: examKeys.detail(variables.id) });
      toast.success('تم تحديث الاختبار بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث الاختبار');
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      toast.success('تم حذف الاختبار بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف الاختبار');
    },
  });
}

export function usePublishExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examsApi.publish(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      queryClient.invalidateQueries({ queryKey: examKeys.detail(id) });
      toast.success('تم نشر الاختبار بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء نشر الاختبار');
    },
  });
}

export function useCancelExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examsApi.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      queryClient.invalidateQueries({ queryKey: examKeys.detail(id) });
      toast.success('تم إلغاء الاختبار بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إلغاء الاختبار');
    },
  });
}

export function useRecordExamResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, results }: { examId: number; results: ExamResultFormData[] }) =>
      examsApi.recordResults(examId, results),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: examKeys.results(variables.examId) });
      queryClient.invalidateQueries({ queryKey: examKeys.statistics(variables.examId) });
      queryClient.invalidateQueries({ queryKey: examKeys.detail(variables.examId) });
      toast.success('تم تسجيل النتائج بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تسجيل النتائج');
    },
  });
}

export function useUpdateExamResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      studentId,
      data,
    }: {
      examId: number;
      studentId: number;
      data: Partial<ExamResultFormData>;
    }) => examsApi.updateResult(examId, studentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: examKeys.results(variables.examId) });
      queryClient.invalidateQueries({ queryKey: examKeys.statistics(variables.examId) });
      toast.success('تم تحديث النتيجة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث النتيجة');
    },
  });
}
