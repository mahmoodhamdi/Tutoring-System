import { Session } from './session';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Attendance {
  id: number;
  session_id: number;
  student_id: number;
  status: AttendanceStatus;
  status_label: string;
  check_in_time: string | null;
  notes: string | null;
  marked_by: number | null;
  session?: Session;
  student?: {
    id: number;
    name: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SessionAttendanceData {
  student_id: number;
  student_name: string;
  student_phone: string;
  attendance_id: number | null;
  status: AttendanceStatus;
  check_in_time: string | null;
  notes: string | null;
}

export interface SessionAttendanceResponse {
  session: {
    id: number;
    title: string;
    scheduled_at: string;
    group_name: string;
  };
  attendances: SessionAttendanceData[];
  summary: {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
}

export interface RecordAttendanceData {
  attendances: {
    student_id: number;
    status: AttendanceStatus;
    check_in_time?: string;
    notes?: string;
  }[];
}

export interface AttendanceReportParams {
  student_id?: number;
  group_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface AttendanceReport {
  summary: {
    total_records: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendance_rate: number;
  };
}
