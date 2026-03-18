'use client';

import Link from 'next/link';
import { SessionStats } from '@/types/dashboard';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

interface UpcomingSessionsProps {
  data: SessionStats;
}

export function UpcomingSessions({ data }: UpcomingSessionsProps) {
  const formatTime = (time: string | null | undefined) => {
    if (!time) return '--:--';
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
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-extrabold text-neutral-900">الجلسات القادمة</h3>
        <Link
          href="/dashboard/sessions"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-150"
        >
          عرض الكل
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5 stagger-children">
        <div className="text-center p-3 bg-secondary-50 rounded-xl border border-secondary-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-xl font-extrabold text-secondary-600">{data.completed}</p>
          <p className="text-xs font-semibold text-secondary-700 mt-0.5">مكتملة</p>
        </div>
        <div className="text-center p-3 bg-info-50 rounded-xl border border-info-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-xl font-extrabold text-info-600">{data.scheduled}</p>
          <p className="text-xs font-semibold text-info-600 mt-0.5">مجدولة</p>
        </div>
        <div className="text-center p-3 bg-error-50 rounded-xl border border-error-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-xl font-extrabold text-error-600">{data.cancelled}</p>
          <p className="text-xs font-semibold text-error-700 mt-0.5">ملغاة</p>
        </div>
      </div>

      {/* Upcoming Sessions List */}
      {data.upcoming.length > 0 ? (
        <div className="space-y-2.5 stagger-children">
          {data.upcoming.map((session) => (
            <Link
              key={session.id}
              href={`/dashboard/sessions/${session.id}`}
              className="block p-4 rounded-xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/40 transition-all duration-200 group card-hover"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors duration-150 truncate">
                    {session.title}
                  </p>
                  {session.group_name && (
                    <p className="text-sm text-neutral-400 mt-0.5">{session.group_name}</p>
                  )}
                </div>
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-lg shrink-0">
                  {formatSessionDate(session.session_date)}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2.5 text-xs text-neutral-400">
                <div className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{new Date(session.session_date).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CalendarDaysIcon className="w-7 h-7 text-neutral-300" />
          </div>
          <p className="text-sm text-neutral-400">لا توجد جلسات قادمة</p>
        </div>
      )}
    </div>
  );
}
