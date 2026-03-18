'use client';

import { useState } from 'react';
import { useSettings, useUpdateSetting, useClearSettingsCache } from '@/hooks/useSettings';
import type { Setting, SettingGroup } from '@/types/setting';
import { SETTING_GROUP_LABELS } from '@/types/setting';
import {
  Cog6ToothIcon,
  CalendarIcon,
  CreditCardIcon,
  UserPlusIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  BellIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const GROUP_ICONS: Record<string, IconComponent> = {
  general: Cog6ToothIcon,
  sessions: CalendarIcon,
  payments: CreditCardIcon,
  registration: UserPlusIcon,
  email: EnvelopeIcon,
  sms: DevicePhoneMobileIcon,
  appearance: PaintBrushIcon,
  notifications: BellIcon,
};

type SettingValue = string | number | boolean | string[];

function SettingInput({
  setting,
  onUpdate,
  isUpdating,
}: {
  setting: Setting;
  onUpdate: (key: string, value: SettingValue) => void;
  isUpdating: boolean;
}) {
  const [localValue, setLocalValue] = useState<SettingValue>(setting.value as SettingValue);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (newValue: SettingValue) => {
    setLocalValue(newValue);
    setIsDirty(true);
  };

  const handleSave = () => {
    onUpdate(setting.key, localValue);
    setIsDirty(false);
  };

  if (setting.type === 'boolean') {
    return (
      <div className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 transition-colors -mx-4">
        <div>
          <label className="font-semibold text-neutral-800">{setting.label}</label>
          <p className="text-sm text-neutral-500 mt-0.5">{setting.description}</p>
        </div>
        <button
          onClick={() => {
            const newValue = !localValue;
            setLocalValue(newValue);
            onUpdate(setting.key, newValue);
          }}
          disabled={isUpdating}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            localValue ? 'bg-primary-600 shadow-[0_0_8px_rgba(99,102,241,0.3)]' : 'bg-neutral-200'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
              localValue ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    );
  }

  if (setting.type === 'integer') {
    return (
      <div className="space-y-2 p-4 rounded-xl hover:bg-neutral-50 transition-colors -mx-4">
        <label className="block font-semibold text-neutral-800">{setting.label}</label>
        <p className="text-sm text-neutral-500">{setting.description}</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={localValue as number}
            onChange={(e) => handleChange(parseInt(e.target.value, 10) || 0)}
            className="flex-1 px-4 py-2.5 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all bg-white"
          />
          {isDirty && (
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="p-2.5 bg-gradient-to-l from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-[0_4px_12px_rgba(99,102,241,0.3)] disabled:opacity-50 transition-all"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (setting.type === 'json') {
    const arrayValue = Array.isArray(localValue) ? (localValue as string[]) : [];
    return (
      <div className="space-y-2 p-4 rounded-xl hover:bg-neutral-50 transition-colors -mx-4">
        <label className="block font-semibold text-neutral-800">{setting.label}</label>
        <p className="text-sm text-neutral-500">{setting.description}</p>
        <div className="flex flex-wrap gap-2">
          {arrayValue.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
            >
              {item}
              <button
                onClick={() => {
                  const newValue = arrayValue.filter((_, i) => i !== index);
                  handleChange(newValue);
                }}
                className="text-primary-400 hover:text-primary-600 transition-colors"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-4 py-2 bg-gradient-to-l from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-[0_4px_12px_rgba(99,102,241,0.3)] disabled:opacity-50 text-sm font-semibold transition-all"
          >
            حفظ التغييرات
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4 rounded-xl hover:bg-neutral-50 transition-colors -mx-4">
      <label className="block font-semibold text-neutral-800">{setting.label}</label>
      <p className="text-sm text-neutral-500">{setting.description}</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={localValue as string}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 px-4 py-2.5 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all bg-white"
        />
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="p-2.5 bg-gradient-to-l from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-[0_4px_12px_rgba(99,102,241,0.3)] disabled:opacity-50 transition-all"
          >
            <CheckIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function SettingsGroup({
  group,
  settings,
  onUpdate,
  isUpdating,
}: {
  group: string;
  settings: Setting[];
  onUpdate: (key: string, value: SettingValue) => void;
  isUpdating: boolean;
}) {
  const Icon = GROUP_ICONS[group] || Cog6ToothIcon;
  const label = SETTING_GROUP_LABELS[group as SettingGroup] || group;

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
        <div className="p-2.5 bg-primary-50 rounded-xl">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-lg font-bold text-neutral-800">{label}</h2>
      </div>
      <div className="p-6 space-y-2">
        {settings.map((setting) => (
          <SettingInput
            key={setting.key}
            setting={setting}
            onUpdate={onUpdate}
            isUpdating={isUpdating}
          />
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data, isLoading, error } = useSettings();
  const updateSetting = useUpdateSetting();
  const clearCache = useClearSettingsCache();
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const handleUpdate = async (key: string, value: SettingValue) => {
    try {
      await updateSetting.mutateAsync({ key, value });
    } catch {
      // handled by global mutation error handler
    }
  };

  const handleClearCache = async () => {
    try {
      await clearCache.mutateAsync();
    } catch {
      // handled by global mutation error handler
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
            <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-neutral-500 font-medium">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-error-50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-error-600 font-semibold">حدث خطأ أثناء تحميل الإعدادات</p>
      </div>
    );
  }

  const groups = data?.groups || [];
  const settingsData = data?.data || {};

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-800">الإعدادات</h1>
          <p className="text-neutral-500 mt-1">إدارة إعدادات النظام والتخصيص</p>
        </div>
        <button
          onClick={handleClearCache}
          disabled={clearCache.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-neutral-700 bg-white border-2 border-neutral-200 rounded-xl hover:bg-neutral-50 disabled:opacity-50 transition-all font-medium"
        >
          <ArrowPathIcon className={`w-5 h-5 ${clearCache.isPending ? 'animate-spin' : ''}`} />
          تحديث الذاكرة المؤقتة
        </button>
      </div>

      {/* Group Navigation */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveGroup(null)}
          className={`px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
            activeGroup === null
              ? 'bg-gradient-to-l from-primary-600 to-primary-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]'
              : 'bg-white border-2 border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
          }`}
        >
          الكل
        </button>
        {groups.map((group) => {
          const Icon = GROUP_ICONS[group] || Cog6ToothIcon;
          const label = SETTING_GROUP_LABELS[group as SettingGroup] || group;
          return (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                activeGroup === group
                  ? 'bg-gradient-to-l from-primary-600 to-primary-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]'
                  : 'bg-white border-2 border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {(activeGroup ? [activeGroup] : groups).map((group) => (
          <SettingsGroup
            key={group}
            group={group}
            settings={settingsData[group] || []}
            onUpdate={handleUpdate}
            isUpdating={updateSetting.isPending}
          />
        ))}
      </div>
    </div>
  );
}
