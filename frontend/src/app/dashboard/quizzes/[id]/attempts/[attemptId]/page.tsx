'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuizAttempt, useGradeAnswer } from '@/hooks/useQuizzes';
import { QuizResults } from '@/components/quizzes';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function AttemptDetailPage() {
  const params = useParams();
  const quizId = parseInt(params.id as string);
  const attemptId = parseInt(params.attemptId as string);

  const { data: attempt, isLoading } = useQuizAttempt(quizId, attemptId);
  const gradeAnswer = useGradeAnswer();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">المحاولة غير موجودة</p>
        <Link href={`/dashboard/quizzes/${quizId}`} className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          العودة للاختبار
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/quizzes/${quizId}`}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{attempt.quiz?.title}</h1>
          <p className="text-gray-600">
            محاولة {attempt.student?.name || 'الطالب'}
          </p>
        </div>
      </div>

      {/* Results */}
      <QuizResults attempt={attempt} showAnswers={true} />
    </div>
  );
}
