import api from '../axios';

// Re-export the api instance as apiClient for backward compatibility
export const apiClient = api;
export default api;

// Pagination interfaces
export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
