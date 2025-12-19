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
          <Link
            href={`/dashboard/students/${student.id}`}
            className="hover:text-gray-700"
          >
            {student.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">تعديل</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">تعديل بيانات الطالب</h1>
        <p className="mt-1 text-sm text-gray-500">
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
