import { useQuery, useMutation } from '@tanstack/react-query';
import { reportsApi, downloadBlob } from '@/lib/api/reports';
import type { ReportFilters } from '@/types/report';

export const reportKeys = {
  all: ['reports'] as const,
  types: () => [...reportKeys.all, 'types'] as const,
  attendance: (filters?: ReportFilters) => [...reportKeys.all, 'attendance', filters] as const,
  payments: (filters?: ReportFilters) => [...reportKeys.all, 'payments', filters] as const,
  performance: (filters?: ReportFilters) => [...reportKeys.all, 'performance', filters] as const,
  students: (filters?: ReportFilters) => [...reportKeys.all, 'students', filters] as const,
  sessions: (filters?: ReportFilters) => [...reportKeys.all, 'sessions', filters] as const,
  financialSummary: (filters?: ReportFilters) => [...reportKeys.all, 'financial-summary', filters] as const,
};

// Report types
export function useReportTypes() {
  return useQuery({
    queryKey: reportKeys.types(),
    queryFn: () => reportsApi.getTypes(),
  });
}

// Attendance report
export function useAttendanceReport(filters?: ReportFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: reportKeys.attendance(filters),
    queryFn: () => reportsApi.getAttendanceReport(filters),
    enabled,
  });
}

// Payments report
export function usePaymentsReport(filters?: ReportFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: reportKeys.payments(filters),
    queryFn: () => reportsApi.getPaymentsReport(filters),
    enabled,
  });
}

// Performance report
export function usePerformanceReport(filters?: ReportFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: reportKeys.performance(filters),
    queryFn: () => reportsApi.getPerformanceReport(filters),
    enabled,
  });
}

// Students report
export function useStudentsReport(filters?: ReportFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: reportKeys.students(filters),
    queryFn: () => reportsApi.getStudentsReport(filters),
    enabled,
  });
}

// Sessions report
export function useSessionsReport(filters?: ReportFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: reportKeys.sessions(filters),
    queryFn: () => reportsApi.getSessionsReport(filters),
    enabled,
  });
}

// Financial summary report
export function useFinancialSummaryReport(filters?: ReportFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: reportKeys.financialSummary(filters),
    queryFn: () => reportsApi.getFinancialSummary(filters),
    enabled,
  });
}

// Export to CSV
export function useExportCsv() {
  return useMutation({
    mutationFn: async ({ reportType, filters }: { reportType: string; filters?: ReportFilters }) => {
      const blob = await reportsApi.exportCsv(reportType, filters);
      const filename = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
      downloadBlob(blob, filename);
      return { success: true };
    },
  });
}
