import { apiClient } from './client';
import {
  Attendance,
  SessionAttendanceResponse,
  RecordAttendanceData,
  AttendanceReportParams,
  AttendanceReport,
} from '@/types/attendance';
import { PaginatedResponse } from '@/types/session';

export const attendanceApi = {
  list: async (
    params: {
      student_id?: number;
      session_id?: number;
      status?: string;
      start_date?: string;
      end_date?: string;
      page?: number;
      per_page?: number;
    } = {}
  ): Promise<PaginatedResponse<Attendance>> => {
    const response = await apiClient.get<PaginatedResponse<Attendance>>('/attendance', { params });
    return response.data;
  },

  getSessionAttendance: async (sessionId: number): Promise<SessionAttendanceResponse> => {
    const response = await apiClient.get<SessionAttendanceResponse>(
      `/sessions/${sessionId}/attendance`
    );
    return response.data;
  },

  recordAttendance: async (
    sessionId: number,
    data: RecordAttendanceData
  ): Promise<{ message: string; recorded_count: number }> => {
    const response = await apiClient.post<{ message: string; recorded_count: number }>(
      `/sessions/${sessionId}/attendance`,
      data
    );
    return response.data;
  },

  update: async (
    id: number,
    data: { status?: string; check_in_time?: string; notes?: string }
  ): Promise<{ data: Attendance; message: string }> => {
    const response = await apiClient.put<{ data: Attendance; message: string }>(
      `/attendance/${id}`,
      data
    );
    return response.data;
  },

  getReport: async (params: AttendanceReportParams = {}): Promise<AttendanceReport> => {
    const response = await apiClient.get<AttendanceReport>('/attendance/report', { params });
    return response.data;
  },
};

export default attendanceApi;
