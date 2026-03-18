'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useStudents, useDeleteStudent } from '@/hooks/useStudents';
import { StudentsTable, StudentsFilter } from '@/components/students';
import { Button } from '@/components/ui/Button';
import { StudentListParams, StudentStatus } from '@/types/student';

export default function StudentsPage() {
  const [params, setParams] = useState<StudentListParams>({
    page: 1,
    per_page: 10,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const { data, isLoading, isError, error } = useStudents(params);
  const deleteStudent = useDeleteStudent();

  const handleSearch = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handleFilter = useCallback(
    (filters: {
      status?: StudentStatus;
      grade_level?: string;
      is_active?: boolean;
    }) => {
      setParams((prev) => ({ ...prev, ...filters, page: 1 }));
    },
    []
  );

  const handleSort = useCallback((field: string, order: 'asc' | 'desc') => {
    setParams((prev) => ({ ...prev, sort_by: field, sort_order: order }));
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteStudent.mutate(id);
    },
    [deleteStudent]
  );

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  if (isError) {
    return (
      <div className="animate-fade-in">
        <div className="bg-error-50 border-2 border-error-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error-100 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-error-700">حدث خطأ</h3>
              <p className="text-sm text-error-600">
                {(error as Error)?.message || 'فشل في تحميل قائمة الطلاب'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-800">الطلاب</h1>
          <p className="mt-1 text-sm text-neutral-500">
            إدارة جميع الطلاب المسجلين في النظام
          </p>
        </div>
        <Link href="/dashboard/students/new">
          <Button
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            إضافة طالب
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <StudentsFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        initialSearch={params.search}
        initialFilters={{
          status: params.status,
          grade_level: params.grade_level,
          is_active: params.is_active,
        }}
      />

      {/* Table */}
      <StudentsTable
        students={data?.data || []}
        isLoading={isLoading}
        onDelete={handleDelete}
        onSort={handleSort}
        sortBy={params.sort_by}
        sortOrder={params.sort_order}
      />

      {/* Pagination */}
      {data && data.meta.last_page > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-neutral-100 p-4">
          <div className="text-sm text-neutral-500">
            عرض{' '}
            <span className="font-bold text-neutral-700">{data.meta.from || 0}</span> إلى{' '}
            <span className="font-bold text-neutral-700">{data.meta.to || 0}</span> من{' '}
            <span className="font-bold text-neutral-700">{data.meta.total}</span> طالب
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.current_page === 1}
              onClick={() => handlePageChange(data.meta.current_page - 1)}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
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
