import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portalApi } from '@/lib/api/portal';

export const portalKeys = {
  all: ['portal'] as const,
  profile: () => [...portalKeys.all, 'profile'] as const,
  dashboard: (studentId?: number) => [...portalKeys.all, 'dashboard', studentId] as const,
  attendance: (params?: any) => [...portalKeys.all, 'attendance', params] as const,
  payments: (params?: any) => [...portalKeys.all, 'payments', params] as const,
  grades: (studentId?: number) => [...portalKeys.all, 'grades', studentId] as const,
  schedule: (params?: any) => [...portalKeys.all, 'schedule', params] as const,
  announcements: (params?: any) => [...portalKeys.all, 'announcements', params] as const,
  announcement: (id: number) => [...portalKeys.all, 'announcement', id] as const,
  children: () => [...portalKeys.all, 'children'] as const,
};

// Login mutation
export function usePortalLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      portalApi.login(identifier, password),
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('portal_token', data.token);
      localStorage.setItem('portal_user', JSON.stringify(data.user));
    },
  });
}

// Logout mutation
export function usePortalLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => portalApi.logout(),
    onSuccess: () => {
      // Clear stored data
      localStorage.removeItem('portal_token');
      localStorage.removeItem('portal_user');
      // Clear all portal queries
      queryClient.invalidateQueries({ queryKey: portalKeys.all });
    },
  });
}

// Profile
export function usePortalProfile() {
  return useQuery({
    queryKey: portalKeys.profile(),
    queryFn: () => portalApi.getProfile(),
  });
}

// Update password
export function usePortalUpdatePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
      newPasswordConfirmation,
    }: {
      currentPassword: string;
      newPassword: string;
      newPasswordConfirmation: string;
    }) => portalApi.updatePassword(currentPassword, newPassword, newPasswordConfirmation),
  });
}

// Dashboard
export function usePortalDashboard(studentId?: number) {
  return useQuery({
    queryKey: portalKeys.dashboard(studentId),
    queryFn: () => portalApi.getDashboard(studentId),
  });
}

// Attendance
export function usePortalAttendance(params?: {
  student_id?: number;
  start_date?: string;
  end_date?: string;
  per_page?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: portalKeys.attendance(params),
    queryFn: () => portalApi.getAttendance(params),
  });
}

// Payments
export function usePortalPayments(params?: {
  student_id?: number;
  status?: string;
  per_page?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: portalKeys.payments(params),
    queryFn: () => portalApi.getPayments(params),
  });
}

// Grades
export function usePortalGrades(studentId?: number) {
  return useQuery({
    queryKey: portalKeys.grades(studentId),
    queryFn: () => portalApi.getGrades(studentId),
  });
}

// Schedule
export function usePortalSchedule(params?: {
  student_id?: number;
  start_date?: string;
  end_date?: string;
}) {
  return useQuery({
    queryKey: portalKeys.schedule(params),
    queryFn: () => portalApi.getSchedule(params),
  });
}

// Announcements
export function usePortalAnnouncements(params?: { per_page?: number; page?: number }) {
  return useQuery({
    queryKey: portalKeys.announcements(params),
    queryFn: () => portalApi.getAnnouncements(params),
  });
}

// Single announcement
export function usePortalAnnouncement(id: number) {
  return useQuery({
    queryKey: portalKeys.announcement(id),
    queryFn: () => portalApi.getAnnouncement(id),
    enabled: !!id,
  });
}

// Children (for parents)
export function usePortalChildren() {
  return useQuery({
    queryKey: portalKeys.children(),
    queryFn: () => portalApi.getChildren(),
  });
}
