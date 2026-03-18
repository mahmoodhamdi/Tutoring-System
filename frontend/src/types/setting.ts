export type SettingType = 'string' | 'boolean' | 'integer' | 'json';

export type SettingGroup =
  | 'general'
  | 'sessions'
  | 'payments'
  | 'registration'
  | 'email'
  | 'sms'
  | 'appearance'
  | 'notifications';

export interface Setting {
  id: number;
  key: string;
  value: string | boolean | number | string[] | Record<string, unknown>;
  type: SettingType;
  group: SettingGroup;
  label: string;
  description: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SettingsGrouped {
  [group: string]: Setting[];
}

export interface SettingsResponse {
  data: SettingsGrouped;
  groups: string[];
}

export interface SettingUpdatePayload {
  key: string;
  value: string | boolean | number | string[] | Record<string, unknown>;
}

export interface BulkUpdatePayload {
  settings: SettingUpdatePayload[];
}

export const SETTING_GROUP_LABELS: Record<SettingGroup, string> = {
  general: 'الإعدادات العامة',
  sessions: 'إعدادات الجلسات',
  payments: 'إعدادات المدفوعات',
  registration: 'إعدادات التسجيل',
  email: 'إعدادات البريد الإلكتروني',
  sms: 'إعدادات الرسائل القصيرة',
  appearance: 'إعدادات المظهر',
  notifications: 'إعدادات الإشعارات',
};

export const SETTING_GROUP_ICONS: Record<SettingGroup, string> = {
  general: 'Cog6ToothIcon',
  sessions: 'CalendarIcon',
  payments: 'CreditCardIcon',
  registration: 'UserPlusIcon',
  email: 'EnvelopeIcon',
  sms: 'DevicePhoneMobileIcon',
  appearance: 'PaintBrushIcon',
  notifications: 'BellIcon',
};

export const SETTING_GROUP_COLORS: Record<SettingGroup, string> = {
  general: 'bg-neutral-100 text-neutral-800',
  sessions: 'bg-primary-100 text-primary-800',
  payments: 'bg-success-100 text-success-800',
  registration: 'bg-secondary-100 text-secondary-800',
  email: 'bg-warning-100 text-warning-800',
  sms: 'bg-accent-100 text-accent-800',
  appearance: 'bg-primary-100 text-primary-800',
  notifications: 'bg-info-100 text-info-800',
};
