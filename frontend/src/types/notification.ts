export type NotificationType =
  | 'session_reminder'
  | 'session_cancelled'
  | 'payment_due'
  | 'payment_received'
  | 'payment_overdue'
  | 'exam_reminder'
  | 'exam_result'
  | 'quiz_available'
  | 'quiz_result'
  | 'announcement'
  | 'attendance_marked'
  | 'group_added'
  | 'general';

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  type_label: string;
  icon: string;
  title: string;
  message: string;
  data?: {
    link?: string;
    [key: string]: unknown;
  };
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationsFilters {
  is_read?: boolean;
  type?: NotificationType;
  days?: number;
  per_page?: number;
  page?: number;
}

export interface NotificationPreferences {
  session_reminder: boolean;
  payment_due: boolean;
  exam_reminder: boolean;
  quiz_available: boolean;
  announcement: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  session_reminder: 'تذكير بالحصة',
  session_cancelled: 'إلغاء حصة',
  payment_due: 'موعد دفع',
  payment_received: 'استلام دفعة',
  payment_overdue: 'دفعة متأخرة',
  exam_reminder: 'تذكير باختبار',
  exam_result: 'نتيجة اختبار',
  quiz_available: 'كويز متاح',
  quiz_result: 'نتيجة كويز',
  announcement: 'إعلان',
  attendance_marked: 'تسجيل حضور',
  group_added: 'إضافة لمجموعة',
  general: 'إشعار عام',
};

export const NOTIFICATION_TYPE_COLORS: Record<NotificationType, string> = {
  session_reminder: 'bg-primary-100 text-primary-800',
  session_cancelled: 'bg-error-100 text-error-800',
  payment_due: 'bg-warning-100 text-warning-800',
  payment_received: 'bg-success-100 text-success-800',
  payment_overdue: 'bg-error-100 text-error-800',
  exam_reminder: 'bg-secondary-100 text-secondary-800',
  exam_result: 'bg-secondary-100 text-secondary-800',
  quiz_available: 'bg-info-100 text-info-800',
  quiz_result: 'bg-info-100 text-info-800',
  announcement: 'bg-accent-100 text-accent-800',
  attendance_marked: 'bg-success-100 text-success-800',
  group_added: 'bg-info-100 text-info-800',
  general: 'bg-neutral-100 text-neutral-800',
};
