'use client';

import Link from 'next/link';
import { Group } from '@/types/group';
import {
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const capacityPercentage = (group.student_count / group.max_students) * 100;
  const capacityColor =
    capacityPercentage >= 90
      ? 'bg-error-500'
      : capacityPercentage >= 70
        ? 'bg-accent-500'
        : 'bg-success-500';

  return (
    <Link
      href={`/dashboard/groups/${group.id}`}
      className="block bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-neutral-900 truncate">{group.name}</h3>
            {group.description && (
              <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{group.description}</p>
            )}
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mr-2 flex-shrink-0 ${
              group.is_active
                ? 'bg-success-100 text-success-700'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {group.is_active ? 'نشطة' : 'غير نشطة'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {group.subject && (
            <div className="flex items-center text-sm text-neutral-600">
              <AcademicCapIcon className="h-4 w-4 ml-2 text-primary-400 flex-shrink-0" />
              <span className="truncate">{group.subject}</span>
            </div>
          )}
          {group.grade_level && (
            <div className="flex items-center text-sm text-neutral-600">
              <CalendarIcon className="h-4 w-4 ml-2 text-secondary-400 flex-shrink-0" />
              <span className="truncate">{group.grade_level}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-neutral-600">
            <UserGroupIcon className="h-4 w-4 ml-2 text-neutral-400 flex-shrink-0" />
            <span>
              {group.student_count} / {group.max_students} طالب
            </span>
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <CurrencyDollarIcon className="h-4 w-4 ml-2 text-accent-400 flex-shrink-0" />
            <span>{group.monthly_fee.toLocaleString('ar-EG')} ج.م / شهر</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-neutral-500">السعة</span>
            <span className="text-neutral-700 font-medium">
              {group.available_spots} مكان متاح
            </span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div
              className={`${capacityColor} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
        </div>

        {group.schedule_description && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="text-sm text-neutral-600">
              <span className="font-semibold">الجدول:</span> {group.schedule_description}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

export default GroupCard;
