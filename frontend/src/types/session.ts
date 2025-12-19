import { Group } from './group';

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Session {
  id: number;
  group_id: number;
  title: string;
  description: string | null;
  scheduled_at: string;
  end_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  location: string | null;
  notes: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  is_past: boolean;
  is_upcoming: boolean;
  group?: Group;
  attendance_count?: number;
  created_at: string;
  updated_at: string;
}

export interface SessionListParams {
  page?: number;
  per_page?: number;
  group_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  date?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface SessionFormData {
  group_id: number;
  title: string;
  description?: string | null;
  scheduled_at: string;
  duration_minutes?: number;
  location?: string | null;
  notes?: string | null;
}

export interface CancelSessionData {
  reason?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}
