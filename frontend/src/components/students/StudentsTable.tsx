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

const statusColors: Record<StudentStatus, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
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

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
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
        className="w-4 h-4 text-blue-600"
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
        className="w-4 h-4 text-blue-600"
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-t border-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد طلاب</h3>
        <p className="mt-1 text-sm text-gray-500">
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <span>الاسم</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                رقم الهاتف
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                المرحلة الدراسية
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الحالة
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  <span>تاريخ التسجيل</span>
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">إجراءات</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.name}
                      </div>
                      {student.email && (
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.profile?.grade_level || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[student.profile?.status || 'active']
                    }`}
                  >
                    {statusLabels[student.profile?.status || 'active']}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.profile?.enrollment_date
                    ? new Date(student.profile.enrollment_date).toLocaleDateString(
                        'ar-EG'
                      )
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      عرض
                    </Link>
                    <Link
                      href={`/dashboard/students/${student.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      تعديل
                    </Link>
                    {deleteId === student.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          تأكيد
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteId(student.id)}
                        className="text-red-600 hover:text-red-900"
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
