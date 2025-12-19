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
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">حدث خطأ</h3>
          <p className="mt-2 text-sm text-red-700">
            {(error as Error)?.message || 'فشل في تحميل قائمة الطلاب'}
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
          <h1 className="text-2xl font-bold text-gray-900">الطلاب</h1>
          <p className="mt-1 text-sm text-gray-500">
            إدارة جميع الطلاب المسجلين في النظام
          </p>
        </div>
        <Link href="/dashboard/students/new">
          <Button>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
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
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            عرض{' '}
            <span className="font-medium">{data.meta.from || 0}</span> إلى{' '}
            <span className="font-medium">{data.meta.to || 0}</span> من{' '}
            <span className="font-medium">{data.meta.total}</span> طالب
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
