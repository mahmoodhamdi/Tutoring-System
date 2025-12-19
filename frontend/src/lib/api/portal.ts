import api from './axios';
import type {
  PortalLoginResponse,
  PortalProfile,
  PortalDashboard,
  PortalAttendanceSummary,
  PortalAttendanceItem,
  PortalPaymentSummary,
  PortalPaymentItem,
  PortalGradesSummary,
  PortalExamResult,
  PortalQuizResult,
  PortalScheduleSession,
  PortalChild,
} from '@/types/portal';
import type { Announcement } from '@/types/announcement';
import type { PaginatedResponse } from '@/types/api';

export const portalApi = {
  // Login
  login: async (identifier: string, password: string): Promise<PortalLoginResponse> => {
    const response = await api.post('/portal/login', { identifier, password });
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/portal/logout');
  },

  // Get profile
  getProfile: async (): Promise<PortalProfile> => {
    const response = await api.get('/portal/profile');
    return response.data;
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<{ message: string }> => {
    const response = await api.post('/portal/password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
    return response.data;
  },

  // Get dashboard
  getDashboard: async (studentId?: number): Promise<PortalDashboard> => {
    const params = studentId ? `?student_id=${studentId}` : '';
    const response = await api.get(`/portal/dashboard${params}`);
    return response.data;
  },

  // Get attendance
  getAttendance: async (params?: {
    student_id?: number;
    start_date?: string;
    end_date?: string;
    per_page?: number;
    page?: number;
  }): Promise<{
    summary: PortalAttendanceSummary;
    data: PortalAttendanceItem[];
    meta: { current_page: number; last_page: number; per_page: number; total: number };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.student_id) queryParams.append('student_id', params.student_id.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const response = await api.get(`/portal/attendance?${queryParams.toString()}`);
    return response.data;
  },

  // Get payments
  getPayments: async (params?: {
    student_id?: number;
    status?: string;
    per_page?: number;
    page?: number;
  }): Promise<{
    summary: PortalPaymentSummary;
    data: PortalPaymentItem[];
    meta: { current_page: number; last_page: number; per_page: number; total: number };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.student_id) queryParams.append('student_id', params.student_id.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const response = await api.get(`/portal/payments?${queryParams.toString()}`);
    return response.data;
  },

  // Get grades
  getGrades: async (studentId?: number): Promise<{
    summary: PortalGradesSummary;
    exams: PortalExamResult[];
    quizzes: PortalQuizResult[];
  }> => {
    const params = studentId ? `?student_id=${studentId}` : '';
    const response = await api.get(`/portal/grades${params}`);
    return response.data;
  },

  // Get schedule
  getSchedule: async (params?: {
    student_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<{
    period: { start_date: string; end_date: string };
    sessions: PortalScheduleSession[];
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.student_id) queryParams.append('student_id', params.student_id.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const response = await api.get(`/portal/schedule?${queryParams.toString()}`);
    return response.data;
  },

  // Get announcements
  getAnnouncements: async (params?: {
    per_page?: number;
    page?: number;
  }): Promise<{
    data: Announcement[];
    meta: { current_page: number; last_page: number; per_page: number; total: number };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const response = await api.get(`/portal/announcements?${queryParams.toString()}`);
    return response.data;
  },

  // Get single announcement
  getAnnouncement: async (id: number): Promise<Announcement> => {
    const response = await api.get(`/portal/announcements/${id}`);
    return response.data;
  },

  // Get children (for parents)
  getChildren: async (): Promise<PortalChild[]> => {
    const response = await api.get('/portal/children');
    return response.data;
  },
};
