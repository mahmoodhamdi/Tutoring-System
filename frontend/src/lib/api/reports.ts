import { apiClient } from './client';
import type {
  ReportType,
  ReportFilters,
  AttendanceReport,
  PaymentReport,
  PerformanceReport,
  StudentsReport,
  SessionsReport,
  FinancialSummaryReport,
} from '@/types/report';

export const reportsApi = {
  // Get available report types
  getTypes: async (): Promise<ReportType[]> => {
    const response = await apiClient.get('/reports/types');
    return response.data;
  },

  // Get attendance report
  getAttendanceReport: async (filters?: ReportFilters): Promise<AttendanceReport> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.group_id) params.append('group_id', filters.group_id.toString());
    if (filters?.student_id) params.append('student_id', filters.student_id.toString());
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get(`/reports/attendance?${params.toString()}`);
    return response.data;
  },

  // Get payments report
  getPaymentsReport: async (filters?: ReportFilters): Promise<PaymentReport> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.student_id) params.append('student_id', filters.student_id.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.payment_method) params.append('payment_method', filters.payment_method);

    const response = await apiClient.get(`/reports/payments?${params.toString()}`);
    return response.data;
  },

  // Get performance report
  getPerformanceReport: async (filters?: ReportFilters): Promise<PerformanceReport> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.group_id) params.append('group_id', filters.group_id.toString());
    if (filters?.student_id) params.append('student_id', filters.student_id.toString());

    const response = await apiClient.get(`/reports/performance?${params.toString()}`);
    return response.data;
  },

  // Get students report
  getStudentsReport: async (filters?: ReportFilters): Promise<StudentsReport> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.group_id) params.append('group_id', filters.group_id.toString());
    if (filters?.grade_level) params.append('grade_level', filters.grade_level);

    const response = await apiClient.get(`/reports/students?${params.toString()}`);
    return response.data;
  },

  // Get sessions report
  getSessionsReport: async (filters?: ReportFilters): Promise<SessionsReport> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.group_id) params.append('group_id', filters.group_id.toString());
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get(`/reports/sessions?${params.toString()}`);
    return response.data;
  },

  // Get financial summary report
  getFinancialSummary: async (filters?: ReportFilters): Promise<FinancialSummaryReport> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await apiClient.get(`/reports/financial-summary?${params.toString()}`);
    return response.data;
  },

  // Export report to CSV
  exportCsv: async (reportType: string, filters?: ReportFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append('report_type', reportType);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.group_id) params.append('group_id', filters.group_id.toString());
    if (filters?.student_id) params.append('student_id', filters.student_id.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.payment_method) params.append('payment_method', filters.payment_method);
    if (filters?.grade_level) params.append('grade_level', filters.grade_level);

    const response = await apiClient.get(`/reports/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Helper function to download blob as file
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
