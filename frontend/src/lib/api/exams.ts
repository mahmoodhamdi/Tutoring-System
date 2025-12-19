import { apiClient } from './client';
import {
  Exam,
  ExamResult,
  ExamListParams,
  ExamFormData,
  ExamResultFormData,
  ExamStatistics,
  PaginatedExamResponse,
} from '@/types/exam';

export const examsApi = {
  list: async (params: ExamListParams = {}): Promise<PaginatedExamResponse> => {
    const response = await apiClient.get('/exams', { params });
    return response.data;
  },

  upcoming: async (params: { group_id?: number; limit?: number } = {}): Promise<Exam[]> => {
    const response = await apiClient.get('/exams/upcoming', { params });
    return response.data.data;
  },

  recent: async (params: { group_id?: number; days?: number; limit?: number } = {}): Promise<Exam[]> => {
    const response = await apiClient.get('/exams/recent', { params });
    return response.data.data;
  },

  get: async (id: number): Promise<Exam> => {
    const response = await apiClient.get(`/exams/${id}`);
    return response.data.data;
  },

  create: async (data: ExamFormData): Promise<Exam> => {
    const response = await apiClient.post('/exams', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<ExamFormData>): Promise<Exam> => {
    const response = await apiClient.put(`/exams/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/exams/${id}`);
  },

  publish: async (id: number): Promise<Exam> => {
    const response = await apiClient.post(`/exams/${id}/publish`);
    return response.data.data;
  },

  cancel: async (id: number): Promise<Exam> => {
    const response = await apiClient.post(`/exams/${id}/cancel`);
    return response.data.data;
  },

  // Results
  getResults: async (examId: number): Promise<ExamResult[]> => {
    const response = await apiClient.get(`/exams/${examId}/results`);
    return response.data.data;
  },

  recordResults: async (examId: number, results: ExamResultFormData[]): Promise<ExamResult[]> => {
    const response = await apiClient.post(`/exams/${examId}/results`, { results });
    return response.data.data;
  },

  updateResult: async (
    examId: number,
    studentId: number,
    data: Partial<ExamResultFormData>
  ): Promise<ExamResult> => {
    const response = await apiClient.put(`/exams/${examId}/results/${studentId}`, data);
    return response.data.data;
  },

  // Statistics
  getStatistics: async (examId: number): Promise<ExamStatistics> => {
    const response = await apiClient.get(`/exams/${examId}/statistics`);
    return response.data.data;
  },

  // Student History
  getStudentExams: async (studentId: number): Promise<ExamResult[]> => {
    const response = await apiClient.get(`/students/${studentId}/exams`);
    return response.data.data;
  },
};
