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
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    scheduled: 'مجدولة',
    completed: 'مكتملة',
    cancelled: 'ملغاة',
  };

  return (
    <Link
      href={`/dashboard/schedule/${session.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
          {showGroup && session.group && (
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <UserGroupIcon className="h-4 w-4 ml-1" />
              {session.group.name}
            </div>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[session.status]}`}
        >
          {statusLabels[session.status]}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 ml-2" />
          {format(new Date(session.scheduled_at), 'EEEE d MMMM yyyy', { locale: arSA })}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 ml-2" />
          {format(new Date(session.scheduled_at), 'h:mm a', { locale: arSA })} - {session.duration_minutes} دقيقة
        </div>
        {session.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 ml-2" />
            {session.location}
          </div>
        )}
      </div>

      {session.description && (
        <p className="mt-3 text-sm text-gray-500 line-clamp-2">{session.description}</p>
      )}
    </Link>
  );
}

export default SessionCard;
