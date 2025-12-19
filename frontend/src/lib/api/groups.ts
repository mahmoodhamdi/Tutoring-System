import { apiClient } from './client';
import {
  Group,
  GroupListParams,
  GroupFormData,
  AddStudentsData,
  GroupStudentListParams,
  GroupStudent,
  PaginatedResponse,
} from '@/types/group';

export const groupsApi = {
  list: async (params: GroupListParams = {}): Promise<PaginatedResponse<Group>> => {
    const response = await apiClient.get<PaginatedResponse<Group>>('/groups', { params });
    return response.data;
  },

  get: async (id: number): Promise<{ data: Group }> => {
    const response = await apiClient.get<{ data: Group }>(`/groups/${id}`);
    return response.data;
  },

  create: async (data: GroupFormData): Promise<{ data: Group }> => {
    const response = await apiClient.post<{ data: Group }>('/groups', data);
    return response.data;
  },

  update: async (id: number, data: Partial<GroupFormData>): Promise<{ data: Group }> => {
    const response = await apiClient.put<{ data: Group }>(`/groups/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/groups/${id}`);
    return response.data;
  },

  addStudents: async (
    groupId: number,
    data: AddStudentsData
  ): Promise<{ message: string; added_count: number }> => {
    const response = await apiClient.post<{ message: string; added_count: number }>(
      `/groups/${groupId}/students`,
      data
    );
    return response.data;
  },

  removeStudent: async (groupId: number, studentId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/groups/${groupId}/students/${studentId}`
    );
    return response.data;
  },

  getStudents: async (
    groupId: number,
    params: GroupStudentListParams = {}
  ): Promise<PaginatedResponse<GroupStudent>> => {
    const response = await apiClient.get<PaginatedResponse<GroupStudent>>(
      `/groups/${groupId}/students`,
      { params }
    );
    return response.data;
  },

  getSessions: async (groupId: number): Promise<{ data: unknown[] }> => {
    const response = await apiClient.get<{ data: unknown[] }>(`/groups/${groupId}/sessions`);
    return response.data;
  },
};

export default groupsApi;
