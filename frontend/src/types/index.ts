// User types
export interface User {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  role: 'teacher' | 'student' | 'parent';
  date_of_birth: string | null;
  gender: 'male' | 'female' | null;
  address: string | null;
  avatar: string | null;
  school_name: string | null;
  grade_level: string | null;
  parent_id: number | null;
  is_active: boolean;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// Student types
export interface StudentProfile {
  id: number;
  user_id: number;
  school_name: string | null;
  grade_level: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  secondary_phone: string | null;
  notes: string | null;
  enrollment_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student extends User {
  profile?: StudentProfile;
  groups?: Group[];
}

// Group types
export interface Group {
  id: number;
  name: string;
  subject: string;
  grade_level: string;
  description: string | null;
  monthly_fee: number;
  max_students: number | null;
  status: 'active' | 'inactive' | 'completed';
  students_count?: number;
  created_at: string;
  updated_at: string;
}

// Session types
export interface Session {
  id: number;
  group_id: number;
  schedule_template_id: number | null;
  session_date: string;
  start_time: string;
  end_time: string;
  topic: string | null;
  notes: string | null;
  location: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  cancellation_reason: string | null;
  group?: Group;
  created_at: string;
  updated_at: string;
}

// Attendance types
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Attendance {
  id: number;
  session_id: number;
  student_id: number;
  status: AttendanceStatus;
  arrived_at: string | null;
  notes: string | null;
  student?: Student;
  session?: Session;
  created_at: string;
  updated_at: string;
}

// Payment types
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'wallet';

export interface MonthlyFee {
  id: number;
  student_id: number;
  group_id: number;
  month: number;
  year: number;
  amount: number;
  discount: number;
  total_due: number;
  status: PaymentStatus;
  due_date: string;
  student?: Student;
  group?: Group;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  student_id: number;
  monthly_fee_id: number | null;
  group_id: number | null;
  amount: number;
  method: PaymentMethod;
  payment_date: string;
  receipt_number: string | null;
  notes: string | null;
  received_by: number | null;
  student?: Student;
  group?: Group;
  created_at: string;
  updated_at: string;
}

// Exam types
export type ExamType = 'quiz' | 'midterm' | 'final' | 'assignment';
export type ExamStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Exam {
  id: number;
  group_id: number;
  title: string;
  description: string | null;
  type: ExamType;
  total_marks: number;
  exam_date: string;
  start_time: string | null;
  duration_minutes: number | null;
  status: ExamStatus;
  group?: Group;
  created_at: string;
  updated_at: string;
}

export interface ExamResult {
  id: number;
  exam_id: number;
  student_id: number;
  marks_obtained: number | null;
  feedback: string | null;
  is_absent: boolean;
  exam?: Exam;
  student?: Student;
  created_at: string;
  updated_at: string;
}

// Quiz types
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface Quiz {
  id: number;
  group_id: number;
  title: string;
  description: string | null;
  duration_minutes: number;
  passing_score: number;
  shuffle_questions: boolean;
  show_answers_after: boolean;
  available_from: string | null;
  available_until: string | null;
  is_active: boolean;
  group?: Group;
  questions?: Question[];
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  type: QuestionType;
  points: number;
  explanation: string | null;
  sort_order: number;
  options?: QuestionOption[];
  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  student_id: number;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
  time_spent_seconds: number | null;
  quiz?: Quiz;
  student?: Student;
  answers?: QuizAnswer[];
  created_at: string;
  updated_at: string;
}

export interface QuizAnswer {
  id: number;
  quiz_attempt_id: number;
  question_id: number;
  selected_option_id: number | null;
  text_answer: string | null;
  is_correct: boolean | null;
  points_earned: number;
  question?: Question;
  created_at: string;
  updated_at: string;
}

// Announcement types
export type AnnouncementType = 'general' | 'exam' | 'payment' | 'schedule' | 'important';
export type AnnouncementTarget = 'all' | 'group' | 'student';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: AnnouncementType;
  target: AnnouncementTarget;
  group_id: number | null;
  is_pinned: boolean;
  publish_at: string | null;
  expires_at: string | null;
  is_published: boolean;
  group?: Group;
  created_at: string;
  updated_at: string;
}

// Notification types
export interface Notification {
  id: string;
  type: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

// Dashboard types
export interface DashboardStats {
  total_students: number;
  total_groups: number;
  today_sessions: number;
  pending_payments: number;
  attendance_rate: number;
  revenue_this_month: number;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
