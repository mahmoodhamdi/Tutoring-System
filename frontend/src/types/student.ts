export type StudentStatus = 'active' | 'inactive' | 'suspended';

export interface StudentProfile {
  id: number;
  grade_level: string | null;
  school_name: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  notes: string | null;
  enrollment_date: string | null;
  status: StudentStatus;
  parent?: {
    id: number;
    name: string;
    email: string | null;
    phone: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  role: 'student';
  date_of_birth: string | null;
  gender: 'male' | 'female' | null;
  avatar: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  profile: StudentProfile | null;
  created_at: string;
  updated_at: string;
}

export interface StudentListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: StudentStatus;
  grade_level?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface StudentListResponse {
  data: Student[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface CreateStudentData {
  name: string;
  email?: string;
  phone: string;
  password: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  is_active?: boolean;
  parent_id?: number;
  grade_level?: string;
  school_name?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  enrollment_date?: string;
  status?: StudentStatus;
}

export interface UpdateStudentData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  is_active?: boolean;
  parent_id?: number | null;
  grade_level?: string;
  school_name?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  enrollment_date?: string;
  status?: StudentStatus;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export interface PaymentSummary {
  total_paid: number;
  total_pending: number;
  total_overdue: number;
}

export interface GradesSummary {
  total_exams: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
}
