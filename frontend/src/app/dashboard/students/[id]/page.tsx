'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudent, useDeleteStudent } from '@/hooks/useStudents';
import { StudentProfileCard } from '@/components/students';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface StudentPageProps {
  params: Promise<{ id: string }>;
}

export default function StudentPage({ params }: StudentPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const studentId = parseInt(id, 10);
  const { data: student, isLoading, isError, error } = useStudent(studentId);
  const deleteStudent = useDeleteStudent();

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      try {
        await deleteStudent.mutateAsync(studentId);
        router.push('/dashboard/students');
      } catch {
        // Error is handled by the mutation
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="error">
          {(error as Error)?.message || 'فشل في تحميل بيانات الطالب'}
        </Alert>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <Alert variant="error">الطالب غير موجود</Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-gray-700">
            لوحة التحكم
          </Link>
          <span>/</span>
          <Link href="/dashboard/students" className="hover:text-gray-700">
            الطلاب
          </Link>
          <span>/</span>
          <span className="text-gray-900">{student.name}</span>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الطالب</h1>
          <div className="flex gap-2">
            <Link href={`/dashboard/students/${student.id}/edit`}>
              <Button variant="outline">
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                تعديل
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleDelete}
              isLoading={deleteStudent.isPending}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              حذف
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <StudentProfileCard student={student} />

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`/dashboard/students/${student.id}/attendance`}
          className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="mr-4">
            <h3 className="text-sm font-medium text-gray-900">الحضور</h3>
            <p className="text-sm text-gray-500">عرض سجل الحضور</p>
          </div>
        </Link>

        <Link
          href={`/dashboard/students/${student.id}/payments`}
          className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="mr-4">
            <h3 className="text-sm font-medium text-gray-900">المدفوعات</h3>
            <p className="text-sm text-gray-500">عرض سجل المدفوعات</p>
          </div>
        </Link>

        <Link
          href={`/dashboard/students/${student.id}/grades`}
          className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg
              className="h-6 w-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="mr-4">
            <h3 className="text-sm font-medium text-gray-900">الدرجات</h3>
            <p className="text-sm text-gray-500">عرض نتائج الاختبارات</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
