// Portal Types

export interface PortalUser {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  role: 'student' | 'parent';
  grade_level?: string;
  status?: string;
}

export interface PortalLoginResponse {
  token: string;
  user: PortalUser;
}

export interface PortalProfile {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  role: 'student' | 'parent';
  date_of_birth?: string;
  gender?: string;
  grade_level?: string;
  school_name?: string;
  enrollment_date?: string;
  status?: string;
  parent?: {
    name: string;
    phone: string;
  };
  groups?: {
    id: number;
    name: string;
  }[];
  children?: {
    id: number;
    name: string;
    grade_level: string;
  }[];
}

export interface PortalDashboard {
  student: {
    id: number;
    name: string;
  };
  attendance: {
    rate: number;
    total: number;
    present: number;
  };
  payments: {
    pending_amount: number;
    overdue_count: number;
  };
  upcoming_sessions: {
    id: number;
    title: string;
    group_name: string | null;
    session_date: string;
    start_time: string;
    end_time: string;
  }[];
  recent_results: {
    id: number;
    exam_title: string;
    exam_date: string;
    obtained_marks: number;
    total_marks: number;
    percentage: number;
    grade: string | null;
    is_passed: boolean;
  }[];
  announcements: {
    id: number;
    title: string;
    type: string;
    priority: string;
    is_pinned: boolean;
    created_at: string;
  }[];
}

export interface PortalAttendanceSummary {
  total: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
  rate: number;
}

export interface PortalAttendanceItem {
  id: number;
  status: string;
  notes: string | null;
  session: {
    id: number;
    title: string;
    session_date: string;
    start_time: string;
    end_time: string;
    group: {
      id: number;
      name: string;
    };
  };
}

export interface PortalPaymentSummary {
  total_paid: number;
  total_pending: number;
  total_overdue: number;
}

export interface PortalPaymentItem {
  id: number;
  amount: number;
  status: string;
  payment_method: string | null;
  payment_date: string | null;
  due_date: string | null;
  description: string | null;
  created_at: string;
}

export interface PortalGradesSummary {
  exam_count: number;
  exam_average: number;
  quiz_count: number;
  quiz_average: number;
}

export interface PortalExamResult {
  type: 'exam';
  id: number;
  title: string;
  date: string;
  group_name: string | null;
  obtained_marks: number;
  total_marks: number;
  percentage: number;
  grade: string | null;
  is_passed: boolean;
}

export interface PortalQuizResult {
  type: 'quiz';
  id: number;
  title: string;
  date: string;
  group_name: string | null;
  score: number;
  total_points: number;
  percentage: number;
  is_passed: boolean;
}

export interface PortalScheduleSession {
  id: number;
  title: string;
  group_name: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  status: string;
  topic: string | null;
  attendance_status: string | null;
}

export interface PortalChild {
  id: number;
  name: string;
  grade_level: string;
  status: string;
  groups: {
    id: number;
    name: string;
  }[];
}

// Status labels
export const PORTAL_ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  present: 'حاضر',
  absent: 'غائب',
  late: 'متأخر',
  excused: 'مستأذن',
};

export const PORTAL_PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: 'مدفوع',
  pending: 'معلق',
  overdue: 'متأخر',
};

export const PORTAL_SESSION_STATUS_LABELS: Record<string, string> = {
  scheduled: 'مجدول',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};
