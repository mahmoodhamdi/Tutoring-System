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
  value: string | boolean | number | string[] | Record<string, any>;
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
  value: string | boolean | number | string[] | Record<string, any>;
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
  general: 'bg-gray-100 text-gray-800',
  sessions: 'bg-blue-100 text-blue-800',
  payments: 'bg-green-100 text-green-800',
  registration: 'bg-purple-100 text-purple-800',
  email: 'bg-yellow-100 text-yellow-800',
  sms: 'bg-orange-100 text-orange-800',
  appearance: 'bg-pink-100 text-pink-800',
  notifications: 'bg-indigo-100 text-indigo-800',
};
