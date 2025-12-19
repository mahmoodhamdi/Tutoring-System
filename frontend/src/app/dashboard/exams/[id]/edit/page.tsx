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
          <Link href={`/dashboard/exams/${examId}`} className="hover:text-gray-700">
            {exam.title}
          </Link>
          <span>/</span>
          <span className="text-gray-900">تعديل</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">تعديل الاختبار</h1>
        <p className="mt-1 text-sm text-gray-500">
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
