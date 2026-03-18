'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Student, StudentStatus } from '@/types/student';
import { Button } from '@/components/ui/Button';

interface StudentsTableProps {
  students: Student[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface SortIconProps {
  field: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const SortIcon = ({ field, sortBy, sortOrder }: SortIconProps) => {
  if (sortBy !== field) {
    return (
      <svg
        className="w-4 h-4 text-neutral-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  }
  return sortOrder === 'asc' ? (
    <svg
      className="w-4 h-4 text-primary-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 text-primary-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};

const statusColors: Record<StudentStatus, string> = {
  active: 'bg-success-100 text-success-700',
  inactive: 'bg-neutral-100 text-neutral-600',
  suspended: 'bg-error-100 text-error-700',
};

const statusLabels: Record<StudentStatus, string> = {
  active: 'نشط',
  inactive: 'غير نشط',
  suspended: 'معلق',
};

export function StudentsTable({
  students,
  isLoading = false,
  onDelete,
  onSort,
  sortBy,
  sortOrder,
}: StudentsTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSort = (field: string) => {
    if (!onSort) return;
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  const handleDelete = (id: number) => {
    if (onDelete) {
      onDelete(id);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-neutral-100" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-50 border-t border-neutral-100" />
          ))}
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 text-center">
        <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="h-8 w-8 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </div>
        <h3 className="mt-3 text-sm font-semibold text-neutral-900">لا يوجد طلاب</h3>
        <p className="mt-1 text-sm text-neutral-500">
          ابدأ بإضافة طالب جديد للنظام
        </p>
        <div className="mt-6">
          <Link href="/dashboard/students/new">
            <Button>إضافة طالب</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-100">
          <thead className="bg-neutral-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <span>الاسم</span>
                  <SortIcon field="name" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider"
              >
                رقم الهاتف
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider"
              >
                المرحلة الدراسية
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider"
              >
                الحالة
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700 transition-colors"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  <span>تاريخ التسجيل</span>
                  <SortIcon field="created_at" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">إجراءات</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-100">
            {students.map((student, idx) => (
              <tr
                key={student.id}
                className={`hover:bg-neutral-50 transition-colors ${idx % 2 === 1 ? 'bg-neutral-50/50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-semibold text-neutral-900">
                        {student.name}
                      </div>
                      {student.email && (
                        <div className="text-sm text-neutral-500">
                          {student.email}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {student.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {student.profile?.grade_level || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[student.profile?.status || 'active']
                    }`}
                  >
                    {statusLabels[student.profile?.status || 'active']}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {student.profile?.enrollment_date
                    ? new Date(student.profile.enrollment_date).toLocaleDateString('ar-EG')
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
                    >
                      عرض
                    </Link>
                    <Link
                      href={`/dashboard/students/${student.id}/edit`}
                      className="text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      تعديل
                    </Link>
                    {deleteId === student.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-error-600 hover:text-error-800 font-medium transition-colors"
                        >
                          تأكيد
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteId(student.id)}
                        className="text-error-600 hover:text-error-800 transition-colors"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
