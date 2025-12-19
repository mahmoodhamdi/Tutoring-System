'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateStudent } from '@/hooks/useStudents';
import { StudentForm } from '@/components/students';
import { CreateStudentData, UpdateStudentData } from '@/types/student';

export default function NewStudentPage() {
  const router = useRouter();
  const createStudent = useCreateStudent();

  const handleSubmit = async (data: CreateStudentData | UpdateStudentData) => {
    try {
      await createStudent.mutateAsync(data as CreateStudentData);
      router.push('/dashboard/students');
    } catch {
      // Error is handled by the mutation
    }
  };

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
          <span className="text-gray-900">إضافة طالب جديد</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">إضافة طالب جديد</h1>
        <p className="mt-1 text-sm text-gray-500">
          أدخل بيانات الطالب الجديد
        </p>
      </div>

      {/* Form */}
      <StudentForm onSubmit={handleSubmit} isLoading={createStudent.isPending} />
    </div>
  );
}
