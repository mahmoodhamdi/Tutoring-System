'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useExam, useUpdateExam } from '@/hooks/useExams';
import { ExamForm } from '@/components/exams';
import { Alert } from '@/components/ui/Alert';
import { ExamFormData } from '@/types/exam';

interface EditExamPageProps {
  params: Promise<{ id: string }>;
}

export default function EditExamPage({ params }: EditExamPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const examId = parseInt(id, 10);

  const { data: exam, isLoading, isError, error } = useExam(examId);
  const updateExam = useUpdateExam();

  const handleSubmit = async (data: ExamFormData) => {
    try {
      await updateExam.mutateAsync({ id: examId, data });
      router.push(`/dashboard/exams/${examId}`);
    } catch {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-100 rounded-xl w-1/4 mb-4" />
          <div className="h-64 bg-neutral-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="error">
          {(error as Error)?.message || 'فشل في تحميل بيانات الاختبار'}
        </Alert>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-6">
        <Alert variant="error">الاختبار غير موجود</Alert>
      </div>
    );
  }

  if (!exam.can_be_edited) {
    return (
      <div className="p-6">
        <Alert variant="error">لا يمكن تعديل هذا الاختبار</Alert>
      </div>
    );
  }

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
          <Link href={`/dashboard/exams/${examId}`} className="hover:text-neutral-700 transition-colors">
            {exam.title}
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-semibold">تعديل</span>
        </nav>
        <h1 className="text-2xl font-extrabold text-neutral-900">تعديل الاختبار</h1>
        <p className="mt-1 text-sm text-neutral-500">
          تعديل بيانات الاختبار
        </p>
      </div>

      {/* Form */}
      <ExamForm
        exam={exam}
        onSubmit={handleSubmit}
        isSubmitting={updateExam.isPending}
      />
    </div>
  );
}
