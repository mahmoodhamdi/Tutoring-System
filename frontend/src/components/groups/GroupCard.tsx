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
      ? 'bg-red-500'
      : capacityPercentage >= 70
        ? 'bg-yellow-500'
        : 'bg-green-500';

  return (
    <Link
      href={`/dashboard/groups/${group.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
            {group.description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{group.description}</p>
            )}
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              group.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {group.is_active ? 'نشطة' : 'غير نشطة'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {group.subject && (
            <div className="flex items-center text-sm text-gray-600">
              <AcademicCapIcon className="h-5 w-5 ml-2 text-gray-400" />
              <span>{group.subject}</span>
            </div>
          )}
          {group.grade_level && (
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-5 w-5 ml-2 text-gray-400" />
              <span>{group.grade_level}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <UserGroupIcon className="h-5 w-5 ml-2 text-gray-400" />
            <span>
              {group.student_count} / {group.max_students} طالب
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CurrencyDollarIcon className="h-5 w-5 ml-2 text-gray-400" />
            <span>{group.monthly_fee.toLocaleString('ar-EG')} ج.م / شهر</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">السعة</span>
            <span className="text-gray-900 font-medium">
              {group.available_spots} مكان متاح
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${capacityColor} h-2 rounded-full transition-all`}
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
        </div>

        {group.schedule_description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-medium">الجدول:</span> {group.schedule_description}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

export default GroupCard;
