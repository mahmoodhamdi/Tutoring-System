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
      className={`flex items-start gap-3 p-4 rounded-lg transition-colors ${
        notification.is_read
          ? 'bg-white hover:bg-gray-50'
          : 'bg-primary-50 hover:bg-primary-100'
      }`}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 p-2 rounded-lg ${
          NOTIFICATION_TYPE_COLORS[notification.type]
        }`}
      >
        <IconComponent icon={notification.icon} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className={`text-sm font-medium ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
              {notification.title}
            </h4>
            {!compact && (
              <p className={`mt-1 text-sm ${notification.is_read ? 'text-gray-500' : 'text-gray-600'}`}>
                {notification.message}
              </p>
            )}
          </div>
          {!notification.is_read && (
            <span className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full"></span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
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
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        {notification.is_read ? (
          onMarkAsUnread && (
            <button
              onClick={() => onMarkAsUnread(notification.id)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
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
              className="p-1 text-gray-400 hover:text-primary-600 rounded"
              title="تحديد كمقروء"
            >
              <CheckCircleIcon className="w-4 h-4" />
            </button>
          )
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(notification.id)}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
            title="حذف"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
