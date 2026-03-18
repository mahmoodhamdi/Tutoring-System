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
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <Link href="/dashboard" className="hover:text-neutral-700 transition-colors">
            لوحة التحكم
          </Link>
          <span className="text-neutral-300">/</span>
          <Link href="/dashboard/exams" className="hover:text-neutral-700 transition-colors">
            الاختبارات
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-semibold">إنشاء اختبار جديد</span>
        </nav>
        <h1 className="text-2xl font-extrabold text-neutral-900">إنشاء اختبار جديد</h1>
        <p className="mt-1 text-sm text-neutral-500">
          أدخل بيانات الاختبار الجديد
        </p>
      </div>

      {/* Form */}
      <ExamForm onSubmit={handleSubmit} isSubmitting={createExam.isPending} />
    </div>
  );
}
