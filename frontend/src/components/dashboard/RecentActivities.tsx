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
  session: 'bg-info-50 text-info-600',
  payment: 'bg-secondary-50 text-secondary-600',
  exam_result: 'bg-primary-50 text-primary-600',
  student: 'bg-primary-50 text-primary-600',
  announcement: 'bg-accent-50 text-accent-600',
};

export function RecentActivities() {
  const { data: activities, isLoading } = useRecentActivities(8);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h3 className="text-lg font-extrabold text-neutral-900 mb-4">النشاط الأخير</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 animate-fade-in">
      <h3 className="text-lg font-extrabold text-neutral-900 mb-4">النشاط الأخير</h3>

      {activities && activities.length > 0 ? (
        <div className="space-y-1 stagger-children">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type] || CalendarIcon;
            const colorClass = activityColors[activity.type] || activityColors.session;

            return (
              <Link
                key={index}
                href={activity.link}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-all duration-150 group"
              >
                <div className={`p-2 rounded-xl shrink-0 transition-transform duration-150 group-hover:scale-110 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-primary-600 transition-colors duration-150">
                    {activity.title}
                  </p>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">{activity.description}</p>
                </div>
                <span className="text-xs text-neutral-300 whitespace-nowrap shrink-0 pt-0.5">
                  {formatDate(activity.date)}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CalendarIcon className="w-6 h-6 text-neutral-300" />
          </div>
          <p className="text-sm text-neutral-400">لا يوجد نشاط حديث</p>
        </div>
      )}
    </div>
  );
}
