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
    [key: string]: any;
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
  session_reminder: 'bg-blue-100 text-blue-800',
  session_cancelled: 'bg-red-100 text-red-800',
  payment_due: 'bg-yellow-100 text-yellow-800',
  payment_received: 'bg-green-100 text-green-800',
  payment_overdue: 'bg-red-100 text-red-800',
  exam_reminder: 'bg-purple-100 text-purple-800',
  exam_result: 'bg-purple-100 text-purple-800',
  quiz_available: 'bg-indigo-100 text-indigo-800',
  quiz_result: 'bg-indigo-100 text-indigo-800',
  announcement: 'bg-orange-100 text-orange-800',
  attendance_marked: 'bg-green-100 text-green-800',
  group_added: 'bg-cyan-100 text-cyan-800',
  general: 'bg-gray-100 text-gray-800',
};
