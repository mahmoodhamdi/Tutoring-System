'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  useAnnouncements,
  usePublishAnnouncement,
  useUnpublishAnnouncement,
  usePinAnnouncement,
  useUnpinAnnouncement,
  useDeleteAnnouncement,
  useMarkAnnouncementAsRead,
  useMarkAllAnnouncementsAsRead,
  useUnreadAnnouncements,
} from '@/hooks/useAnnouncements';
import { useGroups } from '@/hooks/useGroups';
import { AnnouncementCard } from '@/components/announcements';
import { PRIORITY_LABELS, TYPE_LABELS } from '@/types/announcement';
import type { AnnouncementsFilters, AnnouncementPriority, AnnouncementType } from '@/types/announcement';
import { PlusIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function AnnouncementsPage() {
  const [filters, setFilters] = useState<AnnouncementsFilters>({
    group_id: undefined,
    is_published: undefined,
    priority: undefined,
    type: undefined,
    search: '',
  });

  const { data: announcementsData, isLoading } = useAnnouncements(filters);
  const { data: unreadAnnouncements } = useUnreadAnnouncements();
  const { data: groupsData } = useGroups();

  const publishAnnouncement = usePublishAnnouncement();
  const unpublishAnnouncement = useUnpublishAnnouncement();
  const pinAnnouncement = usePinAnnouncement();
  const unpinAnnouncement = useUnpinAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const markAsRead = useMarkAnnouncementAsRead();
  const markAllAsRead = useMarkAllAnnouncementsAsRead();

  const announcements = announcementsData?.data || [];
  const groups = groupsData?.data || [];
  const unreadCount = unreadAnnouncements?.length || 0;

  const handlePublish = async (id: number) => {
    try {
      await publishAnnouncement.mutateAsync(id);
    } catch {
      // handled by global mutation error handler
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await unpublishAnnouncement.mutateAsync(id);
    } catch {
      // handled by global mutation error handler
    }
  };

  const handlePin = async (id: number) => {
    try {
      await pinAnnouncement.mutateAsync(id);
    } catch {
      // handled by global mutation error handler
    }
  };

  const handleUnpin = async (id: number) => {
    try {
      await unpinAnnouncement.mutateAsync(id);
    } catch {
      // handled by global mutation error handler
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    try {
      await deleteAnnouncement.mutateAsync(id);
    } catch {
      // handled by global mutation error handler
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead.mutateAsync(id);
    } catch {
      // handled by global mutation error handler
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
    } catch {
      // handled by global mutation error handler
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">الإعلانات</h1>
          <p className="text-neutral-500">
            إدارة الإعلانات والتنبيهات
            {unreadCount > 0 && (
              <span className="text-primary-600 mr-2 font-semibold">({unreadCount} غير مقروء)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 font-semibold transition-colors"
            >
              <CheckIcon className="w-5 h-5" />
              تحديد الكل كمقروء
            </button>
          )}
          <Link
            href="/dashboard/announcements/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold transition-colors shadow-sm"
          >
            <PlusIcon className="w-5 h-5" />
            إعلان جديد
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="بحث..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pr-10 pl-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

          {/* Group Filter */}
          <select
            value={filters.group_id || ''}
            onChange={(e) => setFilters({ ...filters, group_id: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="">جميع المجموعات</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ ...filters, priority: (e.target.value as AnnouncementPriority) || undefined })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="">جميع الأولويات</option>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({ ...filters, type: (e.target.value as AnnouncementType) || undefined })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="">جميع الأنواع</option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.is_published === undefined ? '' : filters.is_published ? 'published' : 'draft'}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({
                ...filters,
                is_published: value === '' ? undefined : value === 'published',
              });
            }}
            className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full mx-auto animate-spin"></div>
          <p className="text-neutral-500 mt-4">جاري التحميل...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
          <p className="text-neutral-500 mb-4">لا توجد إعلانات</p>
          <Link
            href="/dashboard/announcements/new"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <PlusIcon className="w-5 h-5" />
            إنشاء إعلان جديد
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onPin={handlePin}
              onUnpin={handleUnpin}
              onDelete={handleDelete}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
