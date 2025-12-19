export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'urgent';
export type AnnouncementType = 'general' | 'schedule' | 'exam' | 'payment' | 'event';

export interface Announcement {
  id: number;
  user_id: number;
  group_id?: number;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  priority_label: string;
  type: AnnouncementType;
  type_label: string;
  is_pinned: boolean;
  is_published: boolean;
  is_expired: boolean;
  is_active: boolean;
  is_read?: boolean;
  published_at?: string;
  expires_at?: string;
  reads_count: number;
  author?: {
    id: number;
    name: string;
    email: string;
  };
  group?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementData {
  group_id?: number;
  title: string;
  content: string;
  priority?: AnnouncementPriority;
  type?: AnnouncementType;
  is_pinned?: boolean;
  expires_at?: string;
  publish?: boolean;
}

export interface UpdateAnnouncementData extends Partial<CreateAnnouncementData> {}

export interface AnnouncementsFilters {
  group_id?: number;
  is_published?: boolean;
  active_only?: boolean;
  priority?: AnnouncementPriority;
  type?: AnnouncementType;
  is_pinned?: boolean;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface AnnouncementStatistics {
  total: number;
  published: number;
  active: number;
  pinned: number;
  drafts: number;
  by_type: Record<string, number>;
  by_priority: Record<string, number>;
}

export const PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  low: 'منخفض',
  normal: 'عادي',
  high: 'مرتفع',
  urgent: 'عاجل',
};

export const PRIORITY_COLORS: Record<AnnouncementPriority, string> = {
  low: 'bg-gray-100 text-gray-800',
  normal: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export const TYPE_LABELS: Record<AnnouncementType, string> = {
  general: 'عام',
  schedule: 'جدول',
  exam: 'اختبار',
  payment: 'دفع',
  event: 'فعالية',
};

export const TYPE_ICONS: Record<AnnouncementType, string> = {
  general: 'MegaphoneIcon',
  schedule: 'CalendarIcon',
  exam: 'AcademicCapIcon',
  payment: 'CurrencyDollarIcon',
  event: 'StarIcon',
};
