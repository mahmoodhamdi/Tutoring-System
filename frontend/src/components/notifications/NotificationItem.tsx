'use client';

import Link from 'next/link';
import { Notification, NOTIFICATION_TYPE_COLORS } from '@/types/notification';
import { formatDate } from '@/lib/utils';
import {
  BellIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  MegaphoneIcon,
  CheckCircleIcon,
  UserGroupIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
  onMarkAsUnread?: (id: number) => void;
  onDelete?: (id: number) => void;
  compact?: boolean;
}

const IconComponent = ({ icon }: { icon: string }) => {
  const iconClass = 'w-5 h-5';
  switch (icon) {
    case 'CalendarIcon':
      return <CalendarIcon className={iconClass} />;
    case 'CurrencyDollarIcon':
      return <CurrencyDollarIcon className={iconClass} />;
    case 'AcademicCapIcon':
      return <AcademicCapIcon className={iconClass} />;
    case 'ClipboardDocumentListIcon':
      return <ClipboardDocumentListIcon className={iconClass} />;
    case 'MegaphoneIcon':
      return <MegaphoneIcon className={iconClass} />;
    case 'CheckCircleIcon':
      return <CheckCircleIcon className={iconClass} />;
    case 'UserGroupIcon':
      return <UserGroupIcon className={iconClass} />;
    default:
      return <BellIcon className={iconClass} />;
  }
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const content = (
    <div
      className={`flex items-start gap-3 p-4 transition-all duration-200 ${
        notification.is_read
          ? 'bg-white hover:bg-neutral-50'
          : 'bg-primary-50 hover:bg-primary-100'
      }`}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 p-2 rounded-xl ${
          NOTIFICATION_TYPE_COLORS[notification.type]
        }`}
      >
        <IconComponent icon={notification.icon} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold truncate ${notification.is_read ? 'text-neutral-700' : 'text-neutral-900'}`}>
              {notification.title}
            </h4>
            {!compact && (
              <p className={`mt-0.5 text-sm line-clamp-2 ${notification.is_read ? 'text-neutral-500' : 'text-neutral-600'}`}>
                {notification.message}
              </p>
            )}
          </div>
          {!notification.is_read && (
            <span className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-1 mr-2"></span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
          <span>{notification.type_label}</span>
          <span>•</span>
          <span>{formatDate(notification.created_at)}</span>
        </div>
      </div>
    </div>
  );

  const wrappedContent = notification.data?.link ? (
    <Link href={notification.data.link} onClick={() => !notification.is_read && onMarkAsRead?.(notification.id)}>
      {content}
    </Link>
  ) : (
    content
  );

  if (compact) {
    return wrappedContent;
  }

  return (
    <div className="relative group">
      {wrappedContent}

      {/* Actions */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1">
        {notification.is_read ? (
          onMarkAsUnread && (
            <button
              onClick={() => onMarkAsUnread(notification.id)}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all duration-200"
              title="تحديد كغير مقروء"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
              </svg>
            </button>
          )
        ) : (
          onMarkAsRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              title="تحديد كمقروء"
            >
              <CheckCircleIcon className="w-4 h-4" />
            </button>
          )
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(notification.id)}
            className="p-1.5 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all duration-200"
            title="حذف"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
