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
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-4">
          <div className="h-6 w-48 skeleton" />
          <div className="h-10 w-64 skeleton" />
        </div>
        <div className="h-80 skeleton" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="animate-fade-in">
        <Alert variant="error">
          {(error as Error)?.message || 'فشل في تحميل بيانات الطالب'}
        </Alert>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="animate-fade-in">
        <Alert variant="error">الطالب غير موجود</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-3">
          <Link href="/dashboard" className="hover:text-primary-600 transition-colors">
            لوحة التحكم
          </Link>
          <svg className="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <Link href="/dashboard/students" className="hover:text-primary-600 transition-colors">
            الطلاب
          </Link>
          <svg className="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="text-neutral-700 font-medium">{student.name}</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-neutral-800">تفاصيل الطالب</h1>
          <div className="flex gap-2">
            <Link href={`/dashboard/students/${student.id}/edit`}>
              <Button
                variant="outline"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              >
                تعديل
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteStudent.isPending}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              حذف
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <StudentProfileCard student={student} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        <Link
          href={`/dashboard/students/${student.id}/attendance`}
          className="flex items-center p-5 bg-white rounded-2xl border border-neutral-100 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex-shrink-0 h-12 w-12 bg-info-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="h-6 w-6 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mr-4">
            <h3 className="text-sm font-bold text-neutral-800">الحضور</h3>
            <p className="text-sm text-neutral-500">عرض سجل الحضور</p>
          </div>
        </Link>

        <Link
          href={`/dashboard/students/${student.id}/payments`}
          className="flex items-center p-5 bg-white rounded-2xl border border-neutral-100 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex-shrink-0 h-12 w-12 bg-success-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="h-6 w-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mr-4">
            <h3 className="text-sm font-bold text-neutral-800">المدفوعات</h3>
            <p className="text-sm text-neutral-500">عرض سجل المدفوعات</p>
          </div>
        </Link>

        <Link
          href={`/dashboard/students/${student.id}/grades`}
          className="flex items-center p-5 bg-white rounded-2xl border border-neutral-100 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex-shrink-0 h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="mr-4">
            <h3 className="text-sm font-bold text-neutral-800">الدرجات</h3>
            <p className="text-sm text-neutral-500">عرض نتائج الاختبارات</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
