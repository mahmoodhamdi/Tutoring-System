'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuiz, useStartQuizAttempt, useSubmitQuizAttempt, useMyQuizAttempts } from '@/hooks/useQuizzes';
import { QuizTaker, QuizResults } from '@/components/quizzes';
import { QuizAttempt, SubmitQuizData } from '@/types/quiz';
import { ArrowRightIcon, ClockIcon, AcademicCapIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string);

  const { data: quiz, isLoading: quizLoading } = useQuiz(quizId);
  const { data: myAttempts, isLoading: attemptsLoading } = useMyQuizAttempts(quizId);
  const startAttempt = useStartQuizAttempt();
  const submitAttempt = useSubmitQuizAttempt();

  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const isLoading = quizLoading || attemptsLoading;

  // Check for existing in-progress attempt
  useEffect(() => {
    if (myAttempts) {
      const inProgressAttempt = myAttempts.find((a) => a.status === 'in_progress');
      if (inProgressAttempt) {
        setCurrentAttempt(inProgressAttempt);
        setShowInstructions(false);
      }
    }
  }, [myAttempts]);

  const handleStartQuiz = async () => {
    try {
      const attempt = await startAttempt.mutateAsync(quizId);
      setCurrentAttempt(attempt);
      setShowInstructions(false);
    } catch (error: any) {
      console.error('Failed to start quiz:', error);
      alert(error.response?.data?.message || 'فشل في بدء الاختبار');
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
      setCurrentAttempt(null);
      setCompletedAttempt(result);
    } catch (error: any) {
      console.error('Failed to submit quiz:', error);
      alert(error.response?.data?.message || 'فشل في تسليم الاختبار');
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
        <p className="text-gray-500">الاختبار غير موجود</p>
        <Link href="/dashboard/quizzes" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          العودة للاختبارات
        </Link>
      </div>
    );
  }

  // Show results
  if (completedAttempt) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/quizzes"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">نتيجة الاختبار</p>
          </div>
        </div>

        <QuizResults attempt={completedAttempt} showAnswers={quiz.show_correct_answers} />

        <div className="flex justify-center">
          <Link
            href="/dashboard/quizzes"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/quizzes"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Quiz Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <ClockIcon className="w-6 h-6 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">المدة</p>
              <p className="font-semibold text-gray-900">{quiz.duration_minutes} دقيقة</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <AcademicCapIcon className="w-6 h-6 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">الدرجة الكلية</p>
              <p className="font-semibold text-gray-900">{quiz.total_marks} درجة</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {quiz.description && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">الوصف</h3>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
        )}

        {/* Instructions */}
        {quiz.instructions && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">تعليمات مهمة</h3>
            <p className="text-blue-700">{quiz.instructions}</p>
          </div>
        )}

        {/* Quiz Settings */}
        <div className="mb-6 space-y-2 text-sm text-gray-600">
          <p>• عدد الأسئلة: {quiz.questions_count} سؤال</p>
          <p>• نسبة النجاح: {quiz.pass_percentage}%</p>
          <p>• المحاولات المتبقية: {remainingAttempts} من {quiz.max_attempts}</p>
          {quiz.shuffle_questions && <p>• سيتم خلط ترتيب الأسئلة</p>}
          {quiz.shuffle_answers && <p>• سيتم خلط ترتيب الخيارات</p>}
        </div>

        {/* Warning */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-700">
            <p className="font-medium">تنبيه مهم:</p>
            <p>بمجرد بدء الاختبار، سيبدأ العد التنازلي ولا يمكن إيقافه. تأكد من أنك جاهز قبل البدء.</p>
          </div>
        </div>

        {/* Start Button */}
        {canAttempt ? (
          <button
            onClick={handleStartQuiz}
            disabled={startAttempt.isPending}
            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50"
          >
            {startAttempt.isPending ? 'جاري التحميل...' : 'بدء الاختبار'}
          </button>
        ) : (
          <div className="text-center py-4">
            {!quiz.is_available ? (
              <p className="text-red-600">هذا الاختبار غير متاح حالياً</p>
            ) : (
              <p className="text-red-600">لقد استنفدت جميع محاولاتك المسموح بها</p>
            )}
          </div>
        )}
      </div>

      {/* Previous Attempts */}
      {myAttempts && myAttempts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">محاولاتك السابقة</h3>
          <div className="space-y-3">
            {myAttempts.map((attempt, index) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">المحاولة {index + 1}</p>
                  <p className="text-sm text-gray-500">{attempt.status_label}</p>
                </div>
                {attempt.percentage !== null && attempt.percentage !== undefined && (
                  <div className="text-left">
                    <p className={`font-bold ${attempt.is_passed ? 'text-green-600' : 'text-red-600'}`}>
                      {attempt.percentage.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {attempt.score?.toFixed(1)} / {quiz.total_marks}
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
