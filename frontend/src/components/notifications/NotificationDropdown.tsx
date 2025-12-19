'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  useRecentNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications, isLoading } = useRecentNotifications(5);
  const { data: unreadCount } = useUnreadNotificationsCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead.mutateAsync(id);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount && unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">الإشعارات</h3>
            {unreadCount && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <CheckIcon className="w-4 h-4" />
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">جاري التحميل...</div>
            ) : notifications && notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div key={notification.id} onClick={() => setIsOpen(false)}>
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      compact
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>لا توجد إشعارات</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              عرض جميع الإشعارات
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
