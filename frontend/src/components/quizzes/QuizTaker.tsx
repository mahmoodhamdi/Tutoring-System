'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizAttempt, SubmitQuizData } from '@/types/quiz';
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface QuizTakerProps {
  attempt: QuizAttempt;
  onSubmit: (data: SubmitQuizData) => void;
  isSubmitting?: boolean;
}

export function QuizTaker({ attempt, onSubmit, isSubmitting }: QuizTakerProps) {
  const [answers, setAnswers] = useState<Record<number, { selected_option_id?: number; answer_text?: string }>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(attempt.time_remaining_seconds || 0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const questions = attempt.quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = useCallback(() => {
    const submitData: SubmitQuizData = {
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        ...answer,
      })),
    };
    onSubmit(submitData);
  }, [answers, onSubmit]);

  // Timer
  useEffect(() => {
    if (timeRemaining <= 0 || attempt.status !== 'in_progress') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, attempt.status, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, value: { selected_option_id?: number; answer_text?: string }) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const isQuestionAnswered = (questionId: number) => {
    const answer = answers[questionId];
    return answer && (answer.selected_option_id || answer.answer_text);
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-8 bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <p className="text-neutral-500">لا توجد أسئلة في هذا الاختبار</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with timer */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 p-4 mb-6 shadow-sm rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-neutral-900">{attempt.quiz?.title}</h2>
            <span className="text-sm text-neutral-500">
              سؤال {currentQuestionIndex + 1} من {questions.length}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
            timeRemaining < 300
              ? 'bg-error-100 text-error-700'
              : 'bg-neutral-100 text-neutral-700'
          }`}>
            <ClockIcon className="w-5 h-5" />
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex gap-1">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`flex-1 h-2 rounded-full transition-all duration-200 ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600'
                    : isQuestionAnswered(q.id)
                      ? 'bg-success-500'
                      : 'bg-neutral-200'
                }`}
                title={`سؤال ${index + 1}`}
              />
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            {getAnsweredCount()} من {questions.length} أسئلة تمت الإجابة عليها
          </p>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
            {currentQuestion.question_type_label}
          </span>
          <span className="text-sm text-neutral-500 font-medium">{currentQuestion.marks} درجة</span>
        </div>

        <h3 className="text-base font-bold text-neutral-900 mb-6">{currentQuestion.question_text}</h3>

        {/* Answer Options */}
        {(currentQuestion.question_type === 'multiple_choice' || currentQuestion.question_type === 'true_false') && (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  answers[currentQuestion.id]?.selected_option_id === option.id
                    ? 'border-primary-400 bg-primary-50 shadow-sm'
                    : 'border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question_${currentQuestion.id}`}
                  checked={answers[currentQuestion.id]?.selected_option_id === option.id}
                  onChange={() => handleAnswerChange(currentQuestion.id, { selected_option_id: option.id })}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="text-neutral-700">{option.option_text}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.question_type === 'short_answer' && (
          <input
            type="text"
            value={answers[currentQuestion.id]?.answer_text || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, { answer_text: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white text-neutral-800 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200"
            placeholder="اكتب إجابتك هنا..."
          />
        )}

        {currentQuestion.question_type === 'essay' && (
          <textarea
            value={answers[currentQuestion.id]?.answer_text || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, { answer_text: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white text-neutral-800 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200"
            placeholder="اكتب إجابتك هنا..."
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-5 py-2 text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          السابق
        </button>

        <div className="flex items-center gap-3">
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-6 py-2 bg-gradient-to-l from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all duration-200 font-semibold shadow-sm"
            >
              التالي
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-6 py-2 bg-gradient-to-l from-success-600 to-success-500 text-white rounded-xl hover:from-success-700 hover:to-success-600 transition-all duration-200 font-semibold shadow-sm"
            >
              تسليم الاختبار
            </button>
          )}
        </div>
      </div>

      {/* Questions Navigator */}
      <div className="mt-8 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <h4 className="text-sm font-bold text-neutral-700 mb-4">الانتقال السريع</h4>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                index === currentQuestionIndex
                  ? 'bg-gradient-to-b from-primary-600 to-primary-500 text-white shadow-md'
                  : isQuestionAnswered(q.id)
                    ? 'bg-success-100 text-success-700 border border-success-200'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-neutral-100">
            <div className="flex items-center gap-3 mb-4">
              {getAnsweredCount() < questions.length ? (
                <div className="h-10 w-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-accent-500" />
                </div>
              ) : (
                <div className="h-10 w-10 bg-success-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-success-500" />
                </div>
              )}
              <h3 className="text-lg font-bold text-neutral-900">تأكيد التسليم</h3>
            </div>

            <p className="text-neutral-600 mb-5">
              {getAnsweredCount() < questions.length ? (
                <>
                  لم تجب على جميع الأسئلة. لقد أجبت على {getAnsweredCount()} من {questions.length} سؤال.
                  <br />
                  هل أنت متأكد من تسليم الاختبار؟
                </>
              ) : (
                'هل أنت متأكد من تسليم الاختبار؟'
              )}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 font-medium transition-all duration-200"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-l from-success-600 to-success-500 text-white rounded-xl hover:from-success-700 hover:to-success-600 disabled:opacity-50 font-semibold transition-all duration-200"
              >
                {isSubmitting ? 'جاري التسليم...' : 'تسليم الاختبار'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
