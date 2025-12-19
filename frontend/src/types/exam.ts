import { Group } from './group';

export type ExamType = 'quiz' | 'midterm' | 'final' | 'assignment';
export type ExamStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ExamResultStatus = 'pending' | 'submitted' | 'graded' | 'absent';

export interface Exam {
  id: number;
  group_id: number;
  title: string;
  description: string | null;
  exam_date: string;
  start_time: string | null;
  duration_minutes: number;
  total_marks: number;
  pass_marks: number | null;
  exam_type: ExamType;
  exam_type_label: string;
  status: ExamStatus;
  status_label: string;
  instructions: string | null;
  is_published: boolean;
  is_past: boolean;
  is_upcoming: boolean;
  can_be_edited: boolean;
  results_count: number;
  graded_count: number;
  average_marks: number | null;
  average_percentage: number | null;
  pass_rate: number | null;
  group?: Group;
  results?: ExamResult[];
  created_at: string;
  updated_at: string;
}

export interface ExamResult {
  id: number;
  exam_id: number;
  student_id: number;
  marks_obtained: number | null;
  percentage: number | null;
  grade: string | null;
  grade_label: string | null;
  status: ExamResultStatus;
  status_label: string;
  feedback: string | null;
  is_passed: boolean;
  graded_by: number | null;
  graded_at: string | null;
  student?: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
  exam?: Exam;
  created_at: string;
  updated_at: string;
}

export interface ExamListParams {
  page?: number;
  per_page?: number;
  group_id?: number;
  status?: ExamStatus;
  exam_type?: ExamType;
  is_published?: boolean;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ExamFormData {
  group_id: number;
  title: string;
  description?: string | null;
  exam_date: string;
  start_time?: string | null;
  duration_minutes?: number;
  total_marks: number;
  pass_marks?: number | null;
  exam_type: ExamType;
  instructions?: string | null;
  is_published?: boolean;
}

export interface ExamResultFormData {
  student_id: number;
  marks_obtained?: number | null;
  status: ExamResultStatus;
  feedback?: string | null;
}

export interface ExamStatistics {
  total_students: number;
  graded_count: number;
  absent_count: number;
  pending_count: number;
  average_marks: number | null;
  average_percentage: number | null;
  highest_marks: number | null;
  lowest_marks: number | null;
  pass_count: number;
  fail_count: number;
  pass_rate: number | null;
  grade_distribution: Record<string, number>;
}

export interface PaginatedExamResponse {
  data: Exam[];
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
