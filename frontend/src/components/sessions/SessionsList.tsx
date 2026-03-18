'use client';

import { Session } from '@/types/session';
import { SessionCard } from './SessionCard';
import { CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface SessionsListProps {
  sessions: Session[];
  showGroup?: boolean;
  emptyMessage?: string;
}

export function SessionsList({
  sessions,
  showGroup = true,
  emptyMessage = 'لا توجد جلسات',
}: SessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
          <CalendarIcon className="h-8 w-8 text-neutral-400" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-neutral-900">{emptyMessage}</h3>
        <p className="mt-1 text-sm text-neutral-500">ابدأ بإنشاء جلسة جديدة</p>
        <div className="mt-6">
          <Link
            href="/dashboard/schedule/new"
            className="inline-flex items-center rounded-xl bg-gradient-to-l from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary-700 hover:to-primary-600 transition-all duration-200"
          >
            إنشاء جلسة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} showGroup={showGroup} />
      ))}
    </div>
  );
}

export default SessionsList;
