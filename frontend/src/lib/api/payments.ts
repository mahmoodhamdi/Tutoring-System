import { apiClient } from './client';
import {
  Payment,
  PaymentListParams,
  PaymentFormData,
  PaymentReport,
  PaginatedResponse,
} from '@/types/payment';

export const paymentsApi = {
  list: async (params: PaymentListParams = {}): Promise<PaginatedResponse<Payment>> => {
    const response = await apiClient.get<PaginatedResponse<Payment>>('/payments', { params });
    return response.data;
  },

  pending: async (
    params: { group_id?: number; page?: number; per_page?: number } = {}
  ): Promise<PaginatedResponse<Payment>> => {
    const response = await apiClient.get<PaginatedResponse<Payment>>('/payments/pending', {
      params,
    });
    return response.data;
  },

  overdue: async (
    params: { group_id?: number; page?: number; per_page?: number } = {}
  ): Promise<PaginatedResponse<Payment>> => {
    const response = await apiClient.get<PaginatedResponse<Payment>>('/payments/overdue', {
      params,
    });
    return response.data;
  },

  get: async (id: number): Promise<{ data: Payment }> => {
    const response = await apiClient.get<{ data: Payment }>(`/payments/${id}`);
    return response.data;
  },

  create: async (data: PaymentFormData): Promise<{ data: Payment; message: string }> => {
    const response = await apiClient.post<{ data: Payment; message: string }>('/payments', data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<PaymentFormData>
  ): Promise<{ data: Payment; message: string }> => {
    const response = await apiClient.put<{ data: Payment; message: string }>(
      `/payments/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/payments/${id}`);
    return response.data;
  },

  getReport: async (
    params: {
      group_id?: number;
      start_date?: string;
      end_date?: string;
      period_month?: number;
      period_year?: number;
    } = {}
  ): Promise<PaymentReport> => {
    const response = await apiClient.get<PaymentReport>('/payments/report', { params });
    return response.data;
  },
};

export default paymentsApi;
