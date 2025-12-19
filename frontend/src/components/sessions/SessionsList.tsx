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
      <div className="text-center py-12">
        <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">{emptyMessage}</h3>
        <p className="mt-1 text-sm text-gray-500">ابدأ بإنشاء جلسة جديدة</p>
        <div className="mt-6">
          <Link
            href="/dashboard/schedule/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
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
