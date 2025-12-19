'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateExam } from '@/hooks/useExams';
import { ExamForm } from '@/components/exams';
import { ExamFormData } from '@/types/exam';

export default function NewExamPage() {
  const router = useRouter();
  const createExam = useCreateExam();

  const handleSubmit = async (data: ExamFormData) => {
    try {
      await createExam.mutateAsync(data);
      router.push('/dashboard/exams');
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
          <Link href="/dashboard/exams" className="hover:text-gray-700">
            الاختبارات
          </Link>
          <span>/</span>
          <span className="text-gray-900">إنشاء اختبار جديد</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">إنشاء اختبار جديد</h1>
        <p className="mt-1 text-sm text-gray-500">
          أدخل بيانات الاختبار الجديد
        </p>
      </div>

      {/* Form */}
      <ExamForm onSubmit={handleSubmit} isSubmitting={createExam.isPending} />
    </div>
  );
}
