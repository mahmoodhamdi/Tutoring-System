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
        className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount && unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-error-500 rounded-full shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-neutral-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100 bg-neutral-50">
            <h3 className="font-bold text-neutral-900">الإشعارات</h3>
            {unreadCount && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <CheckIcon className="w-4 h-4" />
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-neutral-500 text-sm">جاري التحميل...</div>
            ) : notifications && notifications.length > 0 ? (
              <div className="divide-y divide-neutral-100">
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
              <div className="p-10 text-center text-neutral-500">
                <div className="h-12 w-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BellIcon className="w-6 h-6 text-neutral-400" />
                </div>
                <p className="text-sm">لا توجد إشعارات</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              عرض جميع الإشعارات
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
