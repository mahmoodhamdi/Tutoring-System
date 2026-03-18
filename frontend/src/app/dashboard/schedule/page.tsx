'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useSessions } from '@/hooks/useSessions';
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

  const handleStatusFilter = useCallback((status?: SessionStatus) => {
    setParams((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-error-50 border border-error-200 rounded-xl p-4">
          <h3 className="text-lg font-bold text-error-800">حدث خطأ</h3>
          <p className="mt-2 text-sm text-error-700">
            {(error as Error)?.message || 'فشل في تحميل الجدول'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">الجدول</h1>
          <p className="mt-1 text-sm text-neutral-500">
            إدارة جلسات التدريس والمواعيد
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-xl border border-neutral-200 p-1 bg-white">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              قائمة
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
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
          className="rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
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
            <div key={i} className="h-24 bg-neutral-100 rounded-xl" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
          <CalendarDaysIcon className="mx-auto h-14 w-14 text-neutral-300" />
          <h3 className="mt-4 text-sm font-bold text-neutral-900">
            لا توجد جلسات
          </h3>
          <p className="mt-1 text-sm text-neutral-500">ابدأ بإضافة جلسة جديدة</p>
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
          <div className="text-sm text-neutral-600">
            عرض <span className="font-semibold">{data.meta.from || 0}</span> إلى{' '}
            <span className="font-semibold">{data.meta.to || 0}</span> من{' '}
            <span className="font-semibold">{data.meta.total}</span> جلسة
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
