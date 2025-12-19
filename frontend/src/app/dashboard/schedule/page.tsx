'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useSessions, useDeleteSession } from '@/hooks/useSessions';
import { SessionsList } from '@/components/sessions';
import { Button } from '@/components/ui/Button';
import { SessionListParams, SessionStatus } from '@/types/session';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function SchedulePage() {
  const [params, setParams] = useState<SessionListParams>({
    page: 1,
    per_page: 10,
    sort_by: 'scheduled_at',
    sort_order: 'desc',
  });

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const { data, isLoading, isError, error } = useSessions(params);
  const deleteSession = useDeleteSession();

  const handleStatusFilter = useCallback((status?: SessionStatus) => {
    setParams((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const handleGroupFilter = useCallback((groupId?: number) => {
    setParams((prev) => ({ ...prev, group_id: groupId, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">حدث خطأ</h3>
          <p className="mt-2 text-sm text-red-700">
            {(error as Error)?.message || 'فشل في تحميل الجدول'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الجدول</h1>
          <p className="mt-1 text-sm text-gray-500">
            إدارة جلسات التدريس والمواعيد
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              قائمة
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'calendar'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              تقويم
            </button>
          </div>
          <Link href="/dashboard/schedule/new">
            <Button>
              <CalendarDaysIcon className="w-5 h-5 ml-2" />
              إضافة جلسة
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          onChange={(e) =>
            handleStatusFilter(e.target.value as SessionStatus | undefined)
          }
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">كل الحالات</option>
          <option value="scheduled">مجدولة</option>
          <option value="completed">مكتملة</option>
          <option value="cancelled">ملغاة</option>
        </select>
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            لا توجد جلسات
          </h3>
          <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة جلسة جديدة</p>
          <div className="mt-6">
            <Link href="/dashboard/schedule/new">
              <Button>إضافة جلسة</Button>
            </Link>
          </div>
        </div>
      ) : (
        <SessionsList sessions={data?.data || []} />
      )}

      {/* Pagination */}
      {data && data.meta.last_page > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            عرض <span className="font-medium">{data.meta.from || 0}</span> إلى{' '}
            <span className="font-medium">{data.meta.to || 0}</span> من{' '}
            <span className="font-medium">{data.meta.total}</span> جلسة
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={data.meta.current_page === 1}
              onClick={() => handlePageChange(data.meta.current_page - 1)}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              disabled={data.meta.current_page === data.meta.last_page}
              onClick={() => handlePageChange(data.meta.current_page + 1)}
            >
              التالي
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
