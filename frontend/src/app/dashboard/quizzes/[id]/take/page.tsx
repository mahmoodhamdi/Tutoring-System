'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuiz, useStartQuizAttempt, useSubmitQuizAttempt, useMyQuizAttempts } from '@/hooks/useQuizzes';
import { QuizTaker, QuizResults } from '@/components/quizzes';
import { QuizAttempt, SubmitQuizData } from '@/types/quiz';
import { ArrowRightIcon, ClockIcon, AcademicCapIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function TakeQuizPage() {
  const params = useParams();
  const quizId = parseInt(params.id as string);

  const { data: quiz, isLoading: quizLoading } = useQuiz(quizId);
  const { data: myAttempts, isLoading: attemptsLoading } = useMyQuizAttempts(quizId);
  const startAttempt = useStartQuizAttempt();
  const submitAttempt = useSubmitQuizAttempt();

  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(null);

  const isLoading = quizLoading || attemptsLoading;

  // Find existing in-progress attempt using useMemo instead of useEffect
  const currentAttempt = useMemo(() => {
    if (myAttempts) {
      return myAttempts.find((a) => a.status === 'in_progress') || null;
    }
    return null;
  }, [myAttempts]);

  const handleStartQuiz = async () => {
    try {
      await startAttempt.mutateAsync(quizId);
      // The attempt will be picked up automatically via the myAttempts query refetch
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      // handled by global mutation error handler
      alert(err.response?.data?.message || 'فشل في بدء الاختبار');
    }
  };

  const handleSubmitQuiz = async (data: SubmitQuizData) => {
    if (!currentAttempt) return;
    try {
      const result = await submitAttempt.mutateAsync({
        quizId,
        attemptId: currentAttempt.id,
        data,
      });
      setCompletedAttempt(result);
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      // handled by global mutation error handler
      alert(err.response?.data?.message || 'فشل في تسليم الاختبار');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">الاختبار غير موجود</p>
        <Link href="/dashboard/quizzes" className="text-primary-600 hover:text-primary-700 mt-4 inline-block font-semibold">
          العودة للاختبارات
        </Link>
      </div>
    );
  }

  // Show results
  if (completedAttempt) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/quizzes"
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900">{quiz.title}</h1>
            <p className="text-neutral-500">نتيجة الاختبار</p>
          </div>
        </div>

        <QuizResults attempt={completedAttempt} showAnswers={quiz.show_correct_answers} />

        <div className="flex justify-center">
          <Link
            href="/dashboard/quizzes"
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold transition-colors shadow-sm"
          >
            العودة للاختبارات
          </Link>
        </div>
      </div>
    );
  }

  // Show quiz taking interface
  if (currentAttempt) {
    return (
      <QuizTaker
        attempt={currentAttempt}
        onSubmit={handleSubmitQuiz}
        isSubmitting={submitAttempt.isPending}
      />
    );
  }

  // Calculate remaining attempts
  const completedAttempts = myAttempts?.filter((a) => ['completed', 'timed_out'].includes(a.status)).length || 0;
  const remainingAttempts = quiz.max_attempts - completedAttempts;
  const canAttempt = quiz.is_available && remainingAttempts > 0;

  // Show instructions page
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/quizzes"
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-extrabold text-neutral-900">{quiz.title}</h1>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        {/* Quiz Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
            <ClockIcon className="w-6 h-6 text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500">المدة</p>
              <p className="font-bold text-neutral-900">{quiz.duration_minutes} دقيقة</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
            <AcademicCapIcon className="w-6 h-6 text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500">الدرجة الكلية</p>
              <p className="font-bold text-neutral-900">{quiz.total_marks} درجة</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {quiz.description && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-700 mb-2">الوصف</h3>
            <p className="text-neutral-600">{quiz.description}</p>
          </div>
        )}

        {/* Instructions */}
        {quiz.instructions && (
          <div className="mb-6 p-4 bg-primary-50 rounded-xl border border-primary-200">
            <h3 className="text-sm font-semibold text-primary-800 mb-2">تعليمات مهمة</h3>
            <p className="text-primary-700">{quiz.instructions}</p>
          </div>
        )}

        {/* Quiz Settings */}
        <div className="mb-6 space-y-2 text-sm text-neutral-600">
          <p>• عدد الأسئلة: {quiz.questions_count} سؤال</p>
          <p>• نسبة النجاح: {quiz.pass_percentage}%</p>
          <p>• المحاولات المتبقية: {remainingAttempts} من {quiz.max_attempts}</p>
          {quiz.shuffle_questions && <p>• سيتم خلط ترتيب الأسئلة</p>}
          {quiz.shuffle_answers && <p>• سيتم خلط ترتيب الخيارات</p>}
        </div>

        {/* Warning */}
        <div className="mb-6 p-4 bg-warning-50 rounded-xl border border-warning-200 flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-warning-700">
            <p className="font-semibold">تنبيه مهم:</p>
            <p>بمجرد بدء الاختبار، سيبدأ العد التنازلي ولا يمكن إيقافه. تأكد من أنك جاهز قبل البدء.</p>
          </div>
        </div>

        {/* Start Button */}
        {canAttempt ? (
          <button
            onClick={handleStartQuiz}
            disabled={startAttempt.isPending}
            className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold disabled:opacity-50 transition-colors shadow-sm"
          >
            {startAttempt.isPending ? 'جاري التحميل...' : 'بدء الاختبار'}
          </button>
        ) : (
          <div className="text-center py-4">
            {!quiz.is_available ? (
              <p className="text-error-600 font-semibold">هذا الاختبار غير متاح حالياً</p>
            ) : (
              <p className="text-error-600 font-semibold">لقد استنفدت جميع محاولاتك المسموح بها</p>
            )}
          </div>
        )}
      </div>

      {/* Previous Attempts */}
      {myAttempts && myAttempts.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">محاولاتك السابقة</h3>
          <div className="space-y-3">
            {myAttempts.map((prevAttempt, index) => (
              <div
                key={prevAttempt.id}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl"
              >
                <div>
                  <p className="font-semibold text-neutral-900">المحاولة {index + 1}</p>
                  <p className="text-sm text-neutral-500">{prevAttempt.status_label}</p>
                </div>
                {prevAttempt.percentage !== null && prevAttempt.percentage !== undefined && (
                  <div className="text-left">
                    <p className={`font-bold ${prevAttempt.is_passed ? 'text-secondary-600' : 'text-error-600'}`}>
                      {prevAttempt.percentage.toFixed(1)}%
                    </p>
                    <p className="text-sm text-neutral-500">
                      {prevAttempt.score?.toFixed(1)} / {quiz.total_marks}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
