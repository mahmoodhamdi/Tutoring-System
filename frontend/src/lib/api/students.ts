import api from '../axios';
import {
  Student,
  StudentListParams,
  StudentListResponse,
  CreateStudentData,
  UpdateStudentData,
  AttendanceSummary,
  PaymentSummary,
  GradesSummary,
} from '@/types/student';

export const studentsApi = {
  /**
   * Get list of students with optional filters
   */
  list: async (params?: StudentListParams): Promise<StudentListResponse> => {
    const response = await api.get<StudentListResponse>('/students', { params });
    return response.data;
  },

  /**
   * Get a single student by ID
   */
  get: async (id: number): Promise<Student> => {
    const response = await api.get<{ data: Student }>(`/students/${id}`);
    return response.data.data;
  },

  /**
   * Create a new student
   */
  create: async (data: CreateStudentData): Promise<Student> => {
    const response = await api.post<{ data: Student }>('/students', data);
    return response.data.data;
  },

  /**
   * Update an existing student
   */
  update: async (id: number, data: UpdateStudentData): Promise<Student> => {
    const response = await api.put<{ data: Student }>(`/students/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a student
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },

  /**
   * Get student attendance records
   */
  getAttendance: async (
    id: number,
    params?: {
      page?: number;
      per_page?: number;
      from?: string;
      to?: string;
      status?: string;
    }
  ): Promise<{
    data: unknown[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    summary: AttendanceSummary;
  }> => {
    const response = await api.get(`/students/${id}/attendance`, { params });
    return response.data;
  },

  /**
   * Get student payment records
   */
  getPayments: async (
    id: number,
    params?: {
      page?: number;
      per_page?: number;
      from?: string;
      to?: string;
      status?: string;
    }
  ): Promise<{
    data: unknown[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    summary: PaymentSummary;
  }> => {
    const response = await api.get(`/students/${id}/payments`, { params });
    return response.data;
  },

  /**
   * Get student grades/exam results
   */
  getGrades: async (
    id: number,
    params?: {
      page?: number;
      per_page?: number;
      from?: string;
      to?: string;
    }
  ): Promise<{
    data: unknown[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    summary: GradesSummary;
  }> => {
    const response = await api.get(`/students/${id}/grades`, { params });
    return response.data;
  },
};
