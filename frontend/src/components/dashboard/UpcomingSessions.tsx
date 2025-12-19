'use client';

import Link from 'next/link';
import { SessionStats } from '@/types/dashboard';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

interface UpcomingSessionsProps {
  data: SessionStats;
}

export function UpcomingSessions({ data }: UpcomingSessionsProps) {
  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const formatSessionDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'اليوم';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'غداً';
    }

    return date.toLocaleDateString('ar-EG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">الجلسات القادمة</h3>
        <Link
          href="/dashboard/sessions"
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          عرض الكل
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <p className="text-xl font-bold text-green-600">{data.completed}</p>
          <p className="text-xs text-green-700">مكتملة</p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-xl font-bold text-blue-600">{data.scheduled}</p>
          <p className="text-xs text-blue-700">مجدولة</p>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <p className="text-xl font-bold text-red-600">{data.cancelled}</p>
          <p className="text-xs text-red-700">ملغاة</p>
        </div>
      </div>

      {/* Upcoming Sessions List */}
      {data.upcoming.length > 0 ? (
        <div className="space-y-3">
          {data.upcoming.map((session) => (
            <Link
              key={session.id}
              href={`/dashboard/sessions/${session.id}`}
              className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{session.title}</p>
                  {session.group_name && (
                    <p className="text-sm text-gray-500">{session.group_name}</p>
                  )}
                </div>
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  {formatSessionDate(session.session_date)}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>{new Date(session.session_date).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <CalendarDaysIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p>لا توجد جلسات قادمة</p>
        </div>
      )}
    </div>
  );
}
