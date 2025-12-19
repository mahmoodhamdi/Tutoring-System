import apiClient from '../apiClient';
import {
  Session,
  SessionListParams,
  SessionFormData,
  CancelSessionData,
  PaginatedResponse,
} from '@/types/session';

export const sessionsApi = {
  list: async (params: SessionListParams = {}): Promise<PaginatedResponse<Session>> => {
    const response = await apiClient.get<PaginatedResponse<Session>>('/sessions', { params });
    return response.data;
  },

  today: async (): Promise<{ data: Session[] }> => {
    const response = await apiClient.get<{ data: Session[] }>('/sessions/today');
    return response.data;
  },

  week: async (): Promise<{ data: Session[] }> => {
    const response = await apiClient.get<{ data: Session[] }>('/sessions/week');
    return response.data;
  },

  upcoming: async (limit = 10): Promise<{ data: Session[] }> => {
    const response = await apiClient.get<{ data: Session[] }>('/sessions/upcoming', {
      params: { limit },
    });
    return response.data;
  },

  get: async (id: number): Promise<{ data: Session }> => {
    const response = await apiClient.get<{ data: Session }>(`/sessions/${id}`);
    return response.data;
  },

  create: async (data: SessionFormData): Promise<{ data: Session; message: string }> => {
    const response = await apiClient.post<{ data: Session; message: string }>('/sessions', data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<SessionFormData>
  ): Promise<{ data: Session; message: string }> => {
    const response = await apiClient.put<{ data: Session; message: string }>(
      `/sessions/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/sessions/${id}`);
    return response.data;
  },

  cancel: async (
    id: number,
    data: CancelSessionData
  ): Promise<{ data: Session; message: string }> => {
    const response = await apiClient.post<{ data: Session; message: string }>(
      `/sessions/${id}/cancel`,
      data
    );
    return response.data;
  },

  complete: async (id: number): Promise<{ data: Session; message: string }> => {
    const response = await apiClient.post<{ data: Session; message: string }>(
      `/sessions/${id}/complete`
    );
    return response.data;
  },
};

export default sessionsApi;
