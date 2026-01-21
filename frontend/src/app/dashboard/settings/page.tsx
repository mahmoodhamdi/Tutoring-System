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

const GROUP_ICONS: Record<string, React.ComponentType<any>> = {
  general: Cog6ToothIcon,
  sessions: CalendarIcon,
  payments: CreditCardIcon,
  registration: UserPlusIcon,
  email: EnvelopeIcon,
  sms: DevicePhoneMobileIcon,
  appearance: PaintBrushIcon,
  notifications: BellIcon,
};

function SettingInput({
  setting,
  onUpdate,
  isUpdating,
}: {
  setting: Setting;
  onUpdate: (key: string, value: any) => void;
  isUpdating: boolean;
}) {
  const [localValue, setLocalValue] = useState(setting.value);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (newValue: any) => {
    setLocalValue(newValue);
    setIsDirty(true);
  };

  const handleSave = () => {
    onUpdate(setting.key, localValue);
    setIsDirty(false);
  };

  if (setting.type === 'boolean') {
    return (
      <div className="flex items-center justify-between">
        <div>
          <label className="font-medium text-gray-900">{setting.label}</label>
          <p className="text-sm text-gray-500">{setting.description}</p>
        </div>
        <button
          onClick={() => {
            const newValue = !localValue;
            setLocalValue(newValue);
            onUpdate(setting.key, newValue);
          }}
          disabled={isUpdating}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            localValue ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              localValue ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    );
  }

  if (setting.type === 'integer') {
    return (
      <div className="space-y-2">
        <label className="block font-medium text-gray-900">{setting.label}</label>
        <p className="text-sm text-gray-500">{setting.description}</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={localValue as number}
            onChange={(e) => handleChange(parseInt(e.target.value, 10) || 0)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {isDirty && (
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (setting.type === 'json') {
    const arrayValue = Array.isArray(localValue) ? localValue : [];
    return (
      <div className="space-y-2">
        <label className="block font-medium text-gray-900">{setting.label}</label>
        <p className="text-sm text-gray-500">{setting.description}</p>
        <div className="flex flex-wrap gap-2">
          {arrayValue.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {item}
              <button
                onClick={() => {
                  const newValue = arrayValue.filter((_, i) => i !== index);
                  handleChange(newValue);
                }}
                className="text-gray-400 hover:text-gray-600"
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
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm"
          >
            حفظ التغييرات
          </button>
        )}
      </div>
    );
  }

  // Default: string
  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-900">{setting.label}</label>
      <p className="text-sm text-gray-500">{setting.description}</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={localValue as string}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
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
  onUpdate: (key: string, value: any) => void;
  isUpdating: boolean;
}) {
  const Icon = GROUP_ICONS[group] || Cog6ToothIcon;
  const label = SETTING_GROUP_LABELS[group as SettingGroup] || group;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
      </div>
      <div className="p-6 space-y-6">
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

  const handleUpdate = async (key: string, value: any) => {
    try {
      await updateSetting.mutateAsync({ key, value });
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      await clearCache.mutateAsync();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">حدث خطأ أثناء تحميل الإعدادات</p>
      </div>
    );
  }

  const groups = data?.groups || [];
  const settingsData = data?.data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600">إدارة إعدادات النظام والتخصيص</p>
        </div>
        <button
          onClick={handleClearCache}
          disabled={clearCache.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-5 h-5 ${clearCache.isPending ? 'animate-spin' : ''}`} />
          تحديث الذاكرة المؤقتة
        </button>
      </div>

      {/* Group Navigation */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveGroup(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeGroup === null
              ? 'bg-primary-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeGroup === group
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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
