'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudent, useUpdateStudent } from '@/hooks/useStudents';
import { StudentForm } from '@/components/students';
import { Alert } from '@/components/ui/Alert';
import { UpdateStudentData } from '@/types/student';

interface EditStudentPageProps {
  params: Promise<{ id: string }>;
}

export default function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const studentId = parseInt(id, 10);
  const { data: student, isLoading, isError, error } = useStudent(studentId);
  const updateStudent = useUpdateStudent();

  const handleSubmit = async (data: UpdateStudentData) => {
    try {
      await updateStudent.mutateAsync({ id: studentId, data });
      router.push(`/dashboard/students/${studentId}`);
    } catch {
      // Error is handled by the mutation
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
          <Link href={`/dashboard/students/${student.id}`} className="hover:text-primary-600 transition-colors">
            {student.name}
          </Link>
          <svg className="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="text-neutral-700 font-medium">تعديل</span>
        </nav>
        <h1 className="text-2xl font-extrabold text-neutral-800">تعديل بيانات الطالب</h1>
        <p className="mt-1 text-sm text-neutral-500">
          قم بتحديث بيانات الطالب
        </p>
      </div>

      {/* Form */}
      <StudentForm
        student={student}
        onSubmit={handleSubmit}
        isLoading={updateStudent.isPending}
      />
    </div>
  );
}
