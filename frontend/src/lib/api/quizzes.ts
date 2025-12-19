import { apiClient, PaginatedResponse } from './client';
import type {
  Quiz,
  QuizAttempt,
  CreateQuizData,
  UpdateQuizData,
  CreateQuestionData,
  UpdateQuestionData,
  SubmitQuizData,
  GradeAnswerData,
  QuizzesFilters,
} from '@/types/quiz';

export const quizzesApi = {
  // Quiz CRUD
  getAll: async (filters?: QuizzesFilters): Promise<PaginatedResponse<Quiz>> => {
    const params = new URLSearchParams();
    if (filters?.group_id) params.append('group_id', String(filters.group_id));
    if (filters?.is_published !== undefined) params.append('is_published', String(filters.is_published));
    if (filters?.available_only) params.append('available_only', '1');
    if (filters?.search) params.append('search', filters.search);
    if (filters?.per_page) params.append('per_page', String(filters.per_page));
    if (filters?.page) params.append('page', String(filters.page));

    const response = await apiClient.get(`/quizzes?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Quiz> => {
    const response = await apiClient.get(`/quizzes/${id}`);
    return response.data.data;
  },

  create: async (data: CreateQuizData): Promise<Quiz> => {
    const response = await apiClient.post('/quizzes', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateQuizData): Promise<Quiz> => {
    const response = await apiClient.put(`/quizzes/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/quizzes/${id}`);
  },

  // Publishing
  publish: async (id: number): Promise<Quiz> => {
    const response = await apiClient.post(`/quizzes/${id}/publish`);
    return response.data.data;
  },

  unpublish: async (id: number): Promise<Quiz> => {
    const response = await apiClient.post(`/quizzes/${id}/unpublish`);
    return response.data.data;
  },

  duplicate: async (id: number): Promise<Quiz> => {
    const response = await apiClient.post(`/quizzes/${id}/duplicate`);
    return response.data.data;
  },

  // Questions management
  addQuestion: async (quizId: number, data: CreateQuestionData): Promise<Quiz> => {
    const response = await apiClient.post(`/quizzes/${quizId}/questions`, data);
    return response.data.data;
  },

  updateQuestion: async (quizId: number, questionId: number, data: UpdateQuestionData): Promise<Quiz> => {
    const response = await apiClient.put(`/quizzes/${quizId}/questions/${questionId}`, data);
    return response.data.data;
  },

  deleteQuestion: async (quizId: number, questionId: number): Promise<Quiz> => {
    const response = await apiClient.delete(`/quizzes/${quizId}/questions/${questionId}`);
    return response.data.data;
  },

  reorderQuestions: async (quizId: number, questionIds: number[]): Promise<Quiz> => {
    const response = await apiClient.post(`/quizzes/${quizId}/questions/reorder`, {
      question_ids: questionIds,
    });
    return response.data.data;
  },

  // Quiz taking (student)
  startAttempt: async (quizId: number): Promise<QuizAttempt> => {
    const response = await apiClient.post(`/quizzes/${quizId}/start`);
    return response.data.data;
  },

  submitAttempt: async (quizId: number, attemptId: number, data: SubmitQuizData): Promise<QuizAttempt> => {
    const response = await apiClient.post(`/quizzes/${quizId}/attempts/${attemptId}/submit`, data);
    return response.data.data;
  },

  getMyAttempts: async (quizId: number): Promise<QuizAttempt[]> => {
    const response = await apiClient.get(`/quizzes/${quizId}/my-attempts`);
    return response.data.data;
  },

  // Attempts management (teacher)
  getAllAttempts: async (quizId: number): Promise<PaginatedResponse<QuizAttempt>> => {
    const response = await apiClient.get(`/quizzes/${quizId}/attempts`);
    return response.data;
  },

  getAttempt: async (quizId: number, attemptId: number): Promise<QuizAttempt> => {
    const response = await apiClient.get(`/quizzes/${quizId}/attempts/${attemptId}`);
    return response.data.data;
  },

  gradeAnswer: async (
    quizId: number,
    attemptId: number,
    answerId: number,
    data: GradeAnswerData
  ): Promise<QuizAttempt> => {
    const response = await apiClient.post(
      `/quizzes/${quizId}/attempts/${attemptId}/answers/${answerId}/grade`,
      data
    );
    return response.data.data;
  },
};
