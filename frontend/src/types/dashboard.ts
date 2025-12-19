// Dashboard Types

export interface OverviewStats {
  total_students: number;
  total_groups: number;
  total_sessions: number;
  total_exams: number;
  total_quizzes: number;
  active_announcements: number;
}

export interface StudentStats {
  new: number;
  active: number;
  inactive: number;
  total: number;
  by_grade: Record<string, number>;
  by_group: {
    name: string;
    count: number;
  }[];
}

export interface SessionStats {
  completed: number;
  scheduled: number;
  cancelled: number;
  total: number;
  by_day_of_week: Record<number, number>;
  upcoming: {
    id: number;
    title: string;
    group_name: string | null;
    session_date: string;
    start_time: string;
    end_time: string;
  }[];
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  rate: number;
  trend: {
    week: string;
    label: string;
    rate: number;
    total: number;
  }[];
  low_attendance_students: {
    id: number;
    name: string;
    rate: number;
    total: number;
    present: number;
  }[];
}

export interface PaymentStats {
  total_paid: number;
  total_pending: number;
  total_overdue: number;
  paid_count: number;
  pending_count: number;
  overdue_count: number;
  collection_rate: number;
  trend: {
    month: string;
    label: string;
    paid: number;
    pending: number;
    overdue: number;
  }[];
  overdue_students: {
    id: number;
    name: string;
    overdue_amount: number;
    overdue_count: number;
  }[];
}

export interface PerformanceStats {
  exam_average: number;
  exam_pass_rate: number;
  quiz_average: number;
  quiz_pass_rate: number;
  top_performers: {
    id: number;
    name: string;
    exam_avg: number;
    quiz_avg: number;
    average: number;
  }[];
  needs_attention: {
    id: number;
    name: string;
    exam_avg: number;
    quiz_avg: number;
    average: number;
  }[];
  by_group: {
    id: number;
    name: string;
    student_count: number;
    exam_avg: number;
  }[];
}

export interface DashboardData {
  overview: OverviewStats;
  students: StudentStats;
  sessions: SessionStats;
  attendance: AttendanceStats;
  payments: PaymentStats;
  performance: PerformanceStats;
}

export interface QuickStats {
  today_sessions: number;
  pending_payments: number;
  overdue_payments: number;
  unread_notifications: number;
  new_students_this_month: number;
  upcoming_exams: number;
}

export interface RecentActivity {
  type: 'session' | 'payment' | 'exam_result' | 'student' | 'announcement';
  title: string;
  description: string;
  date: string;
  link: string;
}

// Day of week labels (Arabic)
export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  1: 'الأحد',
  2: 'الاثنين',
  3: 'الثلاثاء',
  4: 'الأربعاء',
  5: 'الخميس',
  6: 'الجمعة',
  7: 'السبت',
};

// Grade level labels (Arabic)
export const GRADE_LEVEL_LABELS: Record<string, string> = {
  'grade_1': 'الصف الأول',
  'grade_2': 'الصف الثاني',
  'grade_3': 'الصف الثالث',
  'grade_4': 'الصف الرابع',
  'grade_5': 'الصف الخامس',
  'grade_6': 'الصف السادس',
  'grade_7': 'الصف السابع',
  'grade_8': 'الصف الثامن',
  'grade_9': 'الصف التاسع',
  'grade_10': 'الصف العاشر',
  'grade_11': 'الصف الحادي عشر',
  'grade_12': 'الصف الثاني عشر',
};
