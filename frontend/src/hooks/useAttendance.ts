import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/lib/api/attendance';
import { RecordAttendanceData, AttendanceReportParams } from '@/types/attendance';
import { toast } from 'react-hot-toast';

export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (params: object) => [...attendanceKeys.lists(), params] as const,
  session: (sessionId: number) => [...attendanceKeys.all, 'session', sessionId] as const,
  report: (params?: AttendanceReportParams) => [...attendanceKeys.all, 'report', params] as const,
};

export function useAttendanceList(
  params: {
    student_id?: number;
    session_id?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    per_page?: number;
  } = {}
) {
  return useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => attendanceApi.list(params),
  });
}

export function useSessionAttendance(sessionId: number) {
  return useQuery({
    queryKey: attendanceKeys.session(sessionId),
    queryFn: () => attendanceApi.getSessionAttendance(sessionId),
    enabled: !!sessionId,
  });
}

export function useAttendanceReport(params: AttendanceReportParams = {}) {
  return useQuery({
    queryKey: attendanceKeys.report(params),
    queryFn: () => attendanceApi.getReport(params),
  });
}

export function useRecordAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: number; data: RecordAttendanceData }) =>
      attendanceApi.recordAttendance(sessionId, data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.session(variables.sessionId) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      toast.success(`تم تسجيل حضور ${result.recorded_count} طالب`);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تسجيل الحضور');
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { status?: string; check_in_time?: string; notes?: string };
    }) => attendanceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      toast.success('تم تحديث سجل الحضور بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث سجل الحضور');
    },
  });
}
