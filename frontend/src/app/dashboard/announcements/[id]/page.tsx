'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useAnnouncement,
  usePublishAnnouncement,
  useUnpublishAnnouncement,
  usePinAnnouncement,
  useUnpinAnnouncement,
  useDeleteAnnouncement,
} from '@/hooks/useAnnouncements';
import { PRIORITY_COLORS, PRIORITY_LABELS, TYPE_LABELS } from '@/types/announcement';
import { formatDate } from '@/lib/utils';
import {
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const announcementId = parseInt(params.id as string);

  const { data: announcement, isLoading } = useAnnouncement(announcementId);
  const publishAnnouncement = usePublishAnnouncement();
  const unpublishAnnouncement = useUnpublishAnnouncement();
  const pinAnnouncement = usePinAnnouncement();
  const unpinAnnouncement = useUnpinAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const handlePublish = async () => {
    try {
      await publishAnnouncement.mutateAsync(announcementId);
    } catch (error) {
      console.error('Failed to publish announcement:', error);
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishAnnouncement.mutateAsync(announcementId);
    } catch (error) {
      console.error('Failed to unpublish announcement:', error);
    }
  };

  const handlePin = async () => {
    try {
      await pinAnnouncement.mutateAsync(announcementId);
    } catch (error) {
      console.error('Failed to pin announcement:', error);
    }
  };

  const handleUnpin = async () => {
    try {
      await unpinAnnouncement.mutateAsync(announcementId);
    } catch (error) {
      console.error('Failed to unpin announcement:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    try {
      await deleteAnnouncement.mutateAsync(announcementId);
      router.push('/dashboard/announcements');
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">الإعلان غير موجود</p>
        <Link href="/dashboard/announcements" className="text-primary-600 hover:text-primary-700 mt-4 inline-block transition-all duration-200">
          العودة للإعلانات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/announcements"
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-neutral-900">{announcement.title}</h1>
              {announcement.is_pinned && (
                <span className="text-warning-600" title="مثبت">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {announcement.is_published ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  <CheckCircleIcon className="w-3.5 h-3.5 ml-1" />
                  منشور
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                  <XCircleIcon className="w-3.5 h-3.5 ml-1" />
                  مسودة
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
              <span className={`px-2 py-0.5 rounded-full text-xs ${PRIORITY_COLORS[announcement.priority]}`}>
                {PRIORITY_LABELS[announcement.priority]}
              </span>
              <span>•</span>
              <span>{TYPE_LABELS[announcement.type]}</span>
              {announcement.group && (
                <>
                  <span>•</span>
                  <span>{announcement.group.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!announcement.is_published ? (
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-success-600 text-white rounded-xl hover:bg-success-700 transition-all duration-200"
            >
              نشر
            </button>
          ) : (
            <button
              onClick={handleUnpublish}
              className="px-4 py-2 bg-accent-600 text-white rounded-xl hover:bg-accent-700 transition-all duration-200"
            >
              إلغاء النشر
            </button>
          )}
          {!announcement.is_pinned ? (
            <button
              onClick={handlePin}
              className="px-4 py-2 text-warning-700 bg-warning-100 rounded-xl hover:bg-warning-200 transition-all duration-200"
            >
              تثبيت
            </button>
          ) : (
            <button
              onClick={handleUnpin}
              className="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-all duration-200"
            >
              إلغاء التثبيت
            </button>
          )}
          <Link
            href={`/dashboard/announcements/${announcementId}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-all duration-200"
          >
            <PencilIcon className="w-4 h-4" />
            تعديل
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 text-error-700 bg-error-50 rounded-xl hover:bg-error-100 transition-all duration-200"
          >
            <TrashIcon className="w-4 h-4" />
            حذف
          </button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <EyeIcon className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{announcement.reads_count}</p>
              <p className="text-sm text-neutral-500">مشاهدة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <CalendarIcon className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {announcement.published_at ? formatDate(announcement.published_at) : 'لم ينشر'}
              </p>
              <p className="text-sm text-neutral-500">تاريخ النشر</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <ClockIcon className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {announcement.expires_at ? formatDate(announcement.expires_at) : 'غير محدد'}
              </p>
              <p className="text-sm text-neutral-500">تاريخ الانتهاء</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">{announcement.author?.name}</p>
              <p className="text-sm text-neutral-500">الناشر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">المحتوى</h3>
        <div className="prose prose-neutral max-w-none">
          <p className="whitespace-pre-wrap text-neutral-700">{announcement.content}</p>
        </div>
      </div>
    </div>
  );
}
