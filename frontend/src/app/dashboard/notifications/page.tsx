'use client';

import { useState } from 'react';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkNotificationAsUnread,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteReadNotifications,
  useUnreadNotificationsCount,
} from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/notifications';
import { NOTIFICATION_TYPE_LABELS } from '@/types/notification';
import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function NotificationsPage() {
  const [filters, setFilters] = useState({
    is_read: undefined as boolean | undefined,
    type: undefined as string | undefined,
  });

  const { data: notificationsData, isLoading } = useNotifications(filters as any);
  const { data: unreadCount } = useUnreadNotificationsCount();

  const markAsRead = useMarkNotificationAsRead();
  const markAsUnread = useMarkNotificationAsUnread();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();
  const deleteRead = useDeleteReadNotifications();

  const notifications = notificationsData?.data || [];

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead.mutateAsync(id);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAsUnread = async (id: number) => {
    try {
      await markAsUnread.mutateAsync(id);
    } catch (error) {
      console.error('Failed to mark as unread:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDeleteRead = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع الإشعارات المقروءة؟')) return;
    try {
      await deleteRead.mutateAsync();
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
          <p className="text-gray-600">
            جميع الإشعارات الخاصة بك
            {unreadCount && unreadCount > 0 && (
              <span className="text-primary-600 mr-2">({unreadCount} غير مقروء)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <CheckIcon className="w-5 h-5" />
              تحديد الكل كمقروء
            </button>
          )}
          <button
            onClick={handleDeleteRead}
            className="inline-flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
          >
            <TrashIcon className="w-5 h-5" />
            حذف المقروءة
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <select
            value={filters.is_read === undefined ? '' : filters.is_read ? 'read' : 'unread'}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({
                ...filters,
                is_read: value === '' ? undefined : value === 'read',
              });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">جميع الإشعارات</option>
            <option value="unread">غير مقروءة</option>
            <option value="read">مقروءة</option>
          </select>

          {/* Type Filter */}
          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">جميع الأنواع</option>
            {Object.entries(NOTIFICATION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({ is_read: undefined, type: undefined })}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            إعادة تعيين
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">جاري التحميل...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <BellIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">لا توجد إشعارات</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
