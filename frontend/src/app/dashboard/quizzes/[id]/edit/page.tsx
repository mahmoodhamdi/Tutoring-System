'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuiz, useUpdateQuiz } from '@/hooks/useQuizzes';
import { QuizForm } from '@/components/quizzes';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { CreateQuizData } from '@/types/quiz';

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string);

  const { data: quiz, isLoading } = useQuiz(quizId);
  const updateQuiz = useUpdateQuiz();

  const handleSubmit = async (data: CreateQuizData) => {
    try {
      await updateQuiz.mutateAsync({ id: quizId, data });
      router.push(`/dashboard/quizzes/${quizId}`);
    } catch (error) {
      console.error('Failed to update quiz:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">الاختبار غير موجود</p>
        <Link href="/dashboard/quizzes" className="text-primary-600 hover:text-primary-700 mt-4 inline-block transition-all duration-200">
          العودة للاختبارات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/quizzes/${quizId}`}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">تعديل الاختبار</h1>
          <p className="text-neutral-600">{quiz.title}</p>
        </div>
      </div>

      {/* Form */}
      <QuizForm quiz={quiz} onSubmit={handleSubmit} isSubmitting={updateQuiz.isPending} />
    </div>
  );
}
