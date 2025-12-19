'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useExams } from '@/hooks/useExams';
import { ExamCard } from '@/components/exams';
import { Button } from '@/components/ui/Button';
import { ExamListParams, ExamStatus, ExamType } from '@/types/exam';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function ExamsPage() {
  const [params, setParams] = useState<ExamListParams>({
    page: 1,
    per_page: 12,
    sort_by: 'exam_date',
    sort_order: 'desc',
  });

  const { data, isLoading, isError, error } = useExams(params);

  const handleStatusFilter = useCallback((status?: ExamStatus) => {
    setParams((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const handleTypeFilter = useCallback((examType?: ExamType) => {
    setParams((prev) => ({ ...prev, exam_type: examType, page: 1 }));
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
            {(error as Error)?.message || 'فشل في تحميل الاختبارات'}
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
          <h1 className="text-2xl font-bold text-gray-900">الاختبارات</h1>
          <p className="mt-1 text-sm text-gray-500">
            إدارة اختبارات الطلاب وتسجيل النتائج
          </p>
        </div>
        <Link href="/dashboard/exams/new">
          <Button>
            <AcademicCapIcon className="w-5 h-5 ml-2" />
            إنشاء اختبار
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          onChange={(e) =>
            handleStatusFilter(e.target.value as ExamStatus | undefined || undefined)
          }
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">كل الحالات</option>
          <option value="scheduled">مجدول</option>
          <option value="in_progress">قيد التنفيذ</option>
          <option value="completed">مكتمل</option>
          <option value="cancelled">ملغي</option>
        </select>

        <select
          onChange={(e) =>
            handleTypeFilter(e.target.value as ExamType | undefined || undefined)
          }
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">كل الأنواع</option>
          <option value="quiz">اختبار قصير</option>
          <option value="midterm">اختبار نصفي</option>
          <option value="final">اختبار نهائي</option>
          <option value="assignment">واجب</option>
        </select>
      </div>

      {/* Exams Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-12">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">لا توجد اختبارات</h3>
          <p className="mt-1 text-sm text-gray-500">ابدأ بإنشاء اختبار جديد</p>
          <div className="mt-6">
            <Link href="/dashboard/exams/new">
              <Button>إنشاء اختبار</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.meta.last_page > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            عرض <span className="font-medium">{data.meta.from || 0}</span> إلى{' '}
            <span className="font-medium">{data.meta.to || 0}</span> من{' '}
            <span className="font-medium">{data.meta.total}</span> اختبار
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
