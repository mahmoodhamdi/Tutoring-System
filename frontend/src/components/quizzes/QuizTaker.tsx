'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizAttempt, QuizQuestion, SubmitQuizData } from '@/types/quiz';
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

  // Timer
  useEffect(() => {
    if (timeRemaining <= 0 || attempt.status !== 'in_progress') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, attempt.status]);

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

  const handleSubmit = useCallback(() => {
    const submitData: SubmitQuizData = {
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        ...answer,
      })),
    };
    onSubmit(submitData);
  }, [answers, onSubmit]);

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const isQuestionAnswered = (questionId: number) => {
    const answer = answers[questionId];
    return answer && (answer.selected_option_id || answer.answer_text);
  };

  if (!currentQuestion) {
    return <div className="text-center py-8">لا توجد أسئلة في هذا الاختبار</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with timer */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-gray-900">{attempt.quiz?.title}</h2>
            <span className="text-sm text-gray-500">
              سؤال {currentQuestionIndex + 1} من {questions.length}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}>
            <ClockIcon className="w-5 h-5" />
            <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex gap-1">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600'
                    : isQuestionAnswered(q.id)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
                title={`سؤال ${index + 1}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {getAnsweredCount()} من {questions.length} أسئلة تمت الإجابة عليها
          </p>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {currentQuestion.question_type_label}
          </span>
          <span className="text-sm text-gray-500">{currentQuestion.marks} درجة</span>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-6">{currentQuestion.question_text}</h3>

        {/* Answer Options */}
        {(currentQuestion.question_type === 'multiple_choice' || currentQuestion.question_type === 'true_false') && (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  answers[currentQuestion.id]?.selected_option_id === option.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question_${currentQuestion.id}`}
                  checked={answers[currentQuestion.id]?.selected_option_id === option.id}
                  onChange={() => handleAnswerChange(currentQuestion.id, { selected_option_id: option.id })}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-gray-700">{option.option_text}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.question_type === 'short_answer' && (
          <input
            type="text"
            value={answers[currentQuestion.id]?.answer_text || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, { answer_text: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="اكتب إجابتك هنا..."
          />
        )}

        {currentQuestion.question_type === 'essay' && (
          <textarea
            value={answers[currentQuestion.id]?.answer_text || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, { answer_text: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="اكتب إجابتك هنا..."
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          السابق
        </button>

        <div className="flex items-center gap-3">
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              التالي
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              تسليم الاختبار
            </button>
          )}
        </div>
      </div>

      {/* Questions Navigator */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">الانتقال السريع</h4>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-primary-600 text-white'
                  : isQuestionAnswered(q.id)
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              {getAnsweredCount() < questions.length ? (
                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
              ) : (
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">تأكيد التسليم</h3>
            </div>

            <p className="text-gray-600 mb-4">
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
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
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
