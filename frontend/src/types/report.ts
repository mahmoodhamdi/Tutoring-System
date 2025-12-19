// Report Types

export interface ReportType {
  id: string;
  name: string;
  description: string;
  filters: string[];
}

export interface ReportFilters {
  start_date?: string;
  end_date?: string;
  group_id?: number;
  student_id?: number;
  status?: string;
  payment_method?: string;
  grade_level?: string;
}

export interface AttendanceReportSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendance_rate: number;
}

export interface AttendanceByStudent {
  student_id: number;
  student_name: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
}

export interface AttendanceReportItem {
  id: number;
  student_name: string;
  student_phone: string;
  session_title: string;
  session_date: string;
  group_name: string | null;
  status: string;
  status_label: string;
  notes: string | null;
}

export interface AttendanceReport {
  report_type: 'attendance';
  period: {
    start_date: string;
    end_date: string;
  };
  filters: ReportFilters;
  summary: AttendanceReportSummary;
  by_student: AttendanceByStudent[];
  data: AttendanceReportItem[];
}

export interface PaymentReportSummary {
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  total_count: number;
  paid_count: number;
  pending_count: number;
  overdue_count: number;
  collection_rate: number;
}

export interface PaymentByStudent {
  student_id: number;
  student_name: string;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
}

export interface PaymentByMethod {
  method: string;
  count: number;
  amount: number;
}

export interface PaymentReportItem {
  id: number;
  student_name: string;
  student_phone: string;
  amount: number;
  status: string;
  status_label: string;
  payment_method: string | null;
  payment_date: string | null;
  due_date: string | null;
  description: string | null;
  created_at: string;
}

export interface PaymentReport {
  report_type: 'payments';
  period: {
    start_date: string;
    end_date: string;
  };
  filters: ReportFilters;
  summary: PaymentReportSummary;
  by_student: PaymentByStudent[];
  by_method: PaymentByMethod[];
  data: PaymentReportItem[];
}

export interface PerformanceReportSummary {
  total_exams: number;
  total_results: number;
  average_percentage: number;
  pass_count: number;
  fail_count: number;
  pass_rate: number;
}

export interface PerformanceByStudent {
  student_id: number;
  student_name: string;
  exam_count: number;
  exam_average: number;
  quiz_count: number;
  quiz_average: number;
  overall_average: number;
}

export interface ExamResultItem {
  id: number;
  student_name: string;
  exam_title: string;
  exam_date: string;
  group_name: string | null;
  obtained_marks: number;
  total_marks: number;
  percentage: number;
  is_passed: boolean;
  grade: string | null;
}

export interface QuizAttemptItem {
  id: number;
  student_name: string;
  quiz_title: string;
  submitted_at: string;
  group_name: string | null;
  score: number;
  total_points: number;
  percentage: number;
  is_passed: boolean;
}

export interface PerformanceReport {
  report_type: 'performance';
  period: {
    start_date: string;
    end_date: string;
  };
  filters: ReportFilters;
  exam_summary: PerformanceReportSummary;
  quiz_summary: PerformanceReportSummary;
  by_student: PerformanceByStudent[];
  exam_results: ExamResultItem[];
  quiz_attempts: QuizAttemptItem[];
}

export interface StudentsReportSummary {
  total: number;
  active: number;
  inactive: number;
  graduated: number;
}

export interface StudentsByGrade {
  grade_level: string;
  count: number;
}

export interface StudentReportItem {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  grade_level: string | null;
  status: string;
  status_label: string;
  groups: string;
  parent_name: string | null;
  parent_phone: string | null;
  enrollment_date: string | null;
  created_at: string;
}

export interface StudentsReport {
  report_type: 'students';
  filters: ReportFilters;
  summary: StudentsReportSummary;
  by_grade: StudentsByGrade[];
  data: StudentReportItem[];
}

export interface SessionsReportSummary {
  total: number;
  completed: number;
  scheduled: number;
  cancelled: number;
  total_duration_hours: number;
}

export interface SessionsByGroup {
  group_id: number | null;
  group_name: string;
  count: number;
  completed: number;
}

export interface SessionReportItem {
  id: number;
  title: string;
  group_name: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  status: string;
  status_label: string;
  attendances_count: number;
  topic: string | null;
}

export interface SessionsReport {
  report_type: 'sessions';
  period: {
    start_date: string;
    end_date: string;
  };
  filters: ReportFilters;
  summary: SessionsReportSummary;
  by_group: SessionsByGroup[];
  data: SessionReportItem[];
}

export interface FinancialSummary {
  total_revenue: number;
  total_pending: number;
  total_overdue: number;
  total_expected: number;
  collection_rate: number;
}

export interface MonthlyFinancial {
  month: string;
  label: string;
  revenue: number;
  pending: number;
  overdue: number;
  count: number;
}

export interface TopStudent {
  student_id: number;
  student_name: string;
  total: number;
}

export interface OutstandingStudent {
  student_id: number;
  student_name: string;
  outstanding: number;
}

export interface FinancialSummaryReport {
  report_type: 'financial_summary';
  period: {
    start_date: string;
    end_date: string;
  };
  summary: FinancialSummary;
  monthly: MonthlyFinancial[];
  top_students: TopStudent[];
  outstanding_students: OutstandingStudent[];
}

// Status labels for display
export const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  present: 'حاضر',
  absent: 'غائب',
  late: 'متأخر',
  excused: 'مستأذن',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: 'مدفوع',
  pending: 'معلق',
  overdue: 'متأخر',
  cancelled: 'ملغي',
};

export const STUDENT_STATUS_LABELS: Record<string, string> = {
  active: 'نشط',
  inactive: 'غير نشط',
  graduated: 'متخرج',
};

export const SESSION_STATUS_LABELS: Record<string, string> = {
  scheduled: 'مجدول',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};
