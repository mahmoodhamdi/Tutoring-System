'use client';

import Link from 'next/link';
import { Announcement, PRIORITY_COLORS, PRIORITY_LABELS, TYPE_LABELS } from '@/types/announcement';
import { formatDate } from '@/lib/utils';
import {
  MegaphoneIcon,
  CalendarIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface AnnouncementCardProps {
  announcement: Announcement;
  onPublish?: (id: number) => void;
  onUnpublish?: (id: number) => void;
  onPin?: (id: number) => void;
  onUnpin?: (id: number) => void;
  onDelete?: (id: number) => void;
  onMarkAsRead?: (id: number) => void;
  isTeacher?: boolean;
  compact?: boolean;
}

const TypeIcon = ({ type }: { type: string }) => {
  const iconClass = 'w-5 h-5';
  switch (type) {
    case 'schedule':
      return <CalendarIcon className={iconClass} />;
    case 'exam':
      return <AcademicCapIcon className={iconClass} />;
    case 'payment':
      return <CurrencyDollarIcon className={iconClass} />;
    case 'event':
      return <StarIcon className={iconClass} />;
    default:
      return <MegaphoneIcon className={iconClass} />;
  }
};

export function AnnouncementCard({
  announcement,
  onPublish,
  onUnpublish,
  onPin,
  onUnpin,
  onDelete,
  onMarkAsRead,
  isTeacher = true,
  compact = false,
}: AnnouncementCardProps) {
  const isUnread = announcement.is_read === false;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-shadow hover:shadow-md ${
        isUnread ? 'border-primary-300 bg-primary-50/50' : 'border-gray-200'
      } ${announcement.is_pinned ? 'ring-2 ring-yellow-400' : ''}`}
    >
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-3">
          {/* Type Icon */}
          <div className={`p-2 rounded-lg ${PRIORITY_COLORS[announcement.priority]} flex-shrink-0`}>
            <TypeIcon type={announcement.type} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {announcement.is_pinned && (
                <span className="text-yellow-600" title="مثبت">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              <Link
                href={`/dashboard/announcements/${announcement.id}`}
                className={`text-lg font-semibold hover:text-primary-600 transition-colors truncate ${
                  isUnread ? 'text-primary-700' : 'text-gray-900'
                }`}
              >
                {announcement.title}
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 flex-wrap">
              <span>{TYPE_LABELS[announcement.type]}</span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${PRIORITY_COLORS[announcement.priority]}`}>
                {PRIORITY_LABELS[announcement.priority]}
              </span>
              {announcement.group && (
                <>
                  <span>•</span>
                  <span>{announcement.group.name}</span>
                </>
              )}
              {announcement.author && (
                <>
                  <span>•</span>
                  <span>{announcement.author.name}</span>
                </>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {announcement.is_published ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircleIcon className="w-3.5 h-3.5 ml-1" />
                منشور
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <XCircleIcon className="w-3.5 h-3.5 ml-1" />
                مسودة
              </span>
            )}
          </div>
        </div>

        {/* Content Preview */}
        {!compact && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{announcement.content}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {announcement.published_at && (
              <span>{formatDate(announcement.published_at)}</span>
            )}
            {announcement.expires_at && (
              <span className={announcement.is_expired ? 'text-red-500' : ''}>
                ينتهي: {formatDate(announcement.expires_at)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              {announcement.reads_count}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isUnread && onMarkAsRead && (
              <button
                onClick={() => onMarkAsRead(announcement.id)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                تحديد كمقروء
              </button>
            )}

            {isTeacher && (
              <>
                <Link
                  href={`/dashboard/announcements/${announcement.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  عرض
                </Link>
                <Link
                  href={`/dashboard/announcements/${announcement.id}/edit`}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  تعديل
                </Link>
                {!announcement.is_published && onPublish && (
                  <button
                    onClick={() => onPublish(announcement.id)}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    نشر
                  </button>
                )}
                {announcement.is_published && onUnpublish && (
                  <button
                    onClick={() => onUnpublish(announcement.id)}
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    إلغاء النشر
                  </button>
                )}
                {!announcement.is_pinned && onPin && (
                  <button
                    onClick={() => onPin(announcement.id)}
                    className="text-sm text-yellow-600 hover:text-yellow-700"
                  >
                    تثبيت
                  </button>
                )}
                {announcement.is_pinned && onUnpin && (
                  <button
                    onClick={() => onUnpin(announcement.id)}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    إلغاء التثبيت
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(announcement.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    حذف
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
