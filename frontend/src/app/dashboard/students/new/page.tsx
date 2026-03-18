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
          <span className="text-neutral-700 font-medium">إضافة طالب جديد</span>
        </nav>
        <h1 className="text-2xl font-extrabold text-neutral-800">إضافة طالب جديد</h1>
        <p className="mt-1 text-sm text-neutral-500">
          أدخل بيانات الطالب الجديد
        </p>
      </div>

      {/* Form */}
      <StudentForm onSubmit={handleSubmit} isLoading={createStudent.isPending} />
    </div>
  );
}
