'use client';

import Link from 'next/link';
import { useRecentActivities } from '@/hooks/useDashboard';
import { formatDate } from '@/lib/utils';
import {
  CalendarIcon,
  BanknotesIcon,
  AcademicCapIcon,
  UserPlusIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

const activityIcons = {
  session: CalendarIcon,
  payment: BanknotesIcon,
  exam_result: AcademicCapIcon,
  student: UserPlusIcon,
  announcement: MegaphoneIcon,
};

const activityColors = {
  session: 'bg-blue-50 text-blue-600',
  payment: 'bg-green-50 text-green-600',
  exam_result: 'bg-purple-50 text-purple-600',
  student: 'bg-primary-50 text-primary-600',
  announcement: 'bg-yellow-50 text-yellow-600',
};

export function RecentActivities() {
  const { data: activities, isLoading } = useRecentActivities(8);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>

      {activities && activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type] || CalendarIcon;
            const colorClass = activityColors[activity.type] || activityColors.session;

            return (
              <Link
                key={index}
                href={activity.link}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDate(activity.date)}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>لا يوجد نشاط حديث</p>
        </div>
      )}
    </div>
  );
}
