import { Student } from './student';

export interface Group {
  id: number;
  name: string;
  description: string | null;
  subject: string | null;
  grade_level: string | null;
  max_students: number;
  monthly_fee: number;
  schedule_description: string | null;
  is_active: boolean;
  student_count: number;
  available_spots: number;
  students?: GroupStudent[];
  created_at: string;
  updated_at: string;
}

export interface GroupStudent extends Student {
  pivot: {
    joined_at: string;
    left_at: string | null;
    is_active: boolean;
    notes: string | null;
  };
}

export interface GroupListParams {
  page?: number;
  per_page?: number;
  search?: string;
  subject?: string;
  grade_level?: string;
  is_active?: boolean;
}

export interface GroupFormData {
  name: string;
  description?: string | null;
  subject?: string | null;
  grade_level?: string | null;
  max_students?: number;
  monthly_fee?: number;
  schedule_description?: string | null;
  is_active?: boolean;
}

export interface AddStudentsData {
  student_ids: number[];
  joined_at?: string;
}

export interface GroupStudentListParams {
  page?: number;
  per_page?: number;
  include_inactive?: boolean;
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
