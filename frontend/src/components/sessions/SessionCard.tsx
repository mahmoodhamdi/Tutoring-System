'use client';

import Link from 'next/link';
import { Session } from '@/types/session';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import {
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface SessionCardProps {
  session: Session;
  showGroup?: boolean;
}

export function SessionCard({ session, showGroup = true }: SessionCardProps) {
  const statusColors = {
    scheduled: 'bg-primary-100 text-primary-700',
    completed: 'bg-success-100 text-success-700',
    cancelled: 'bg-error-100 text-error-700',
  };

  const statusLabels = {
    scheduled: 'مجدولة',
    completed: 'مكتملة',
    cancelled: 'ملغاة',
  };

  return (
    <Link
      href={`/dashboard/schedule/${session.id}`}
      className="block bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-base font-bold text-neutral-900">{session.title}</h3>
          {showGroup && session.group && (
            <div className="flex items-center mt-1 text-sm text-neutral-500">
              <UserGroupIcon className="h-4 w-4 ml-1 text-neutral-400 flex-shrink-0" />
              {session.group.name}
            </div>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold flex-shrink-0 ${statusColors[session.status]}`}
        >
          {statusLabels[session.status]}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-neutral-600">
          <CalendarIcon className="h-4 w-4 ml-2 text-primary-400 flex-shrink-0" />
          {session.scheduled_at
            ? format(new Date(session.scheduled_at), 'EEEE d MMMM yyyy', { locale: arSA })
            : session.session_date
              ? format(new Date(session.session_date + 'T00:00:00'), 'EEEE d MMMM yyyy', { locale: arSA })
              : '-'}
        </div>
        <div className="flex items-center text-sm text-neutral-600">
          <ClockIcon className="h-4 w-4 ml-2 text-secondary-400 flex-shrink-0" />
          {session.scheduled_at
            ? format(new Date(session.scheduled_at), 'h:mm a', { locale: arSA })
            : session.start_time
              ? session.start_time.substring(0, 5)
              : '--:--'}{' '}
          - {session.duration_minutes} دقيقة
        </div>
        {session.location && (
          <div className="flex items-center text-sm text-neutral-600">
            <MapPinIcon className="h-4 w-4 ml-2 text-accent-400 flex-shrink-0" />
            {session.location}
          </div>
        )}
      </div>

      {session.description && (
        <p className="mt-3 text-sm text-neutral-500 line-clamp-2">{session.description}</p>
      )}
    </Link>
  );
}

export default SessionCard;
