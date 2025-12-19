'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useQuiz,
  usePublishQuiz,
  useUnpublishQuiz,
  useAddQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useQuizAttempts,
} from '@/hooks/useQuizzes';
import { QuestionForm, AttemptsTable } from '@/components/quizzes';
import { QuizQuestion, CreateQuestionData, QUESTION_TYPE_LABELS } from '@/types/quiz';
import { formatDate } from '@/lib/utils';
import {
  ArrowRightIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string);

  const { data: quiz, isLoading } = useQuiz(quizId);
  const { data: attemptsData } = useQuizAttempts(quizId);
  const publishQuiz = usePublishQuiz();
  const unpublishQuiz = useUnpublishQuiz();
  const addQuestion = useAddQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [activeTab, setActiveTab] = useState<'questions' | 'attempts'>('questions');

  const attempts = attemptsData?.data || [];

  const handlePublish = async () => {
    try {
      await publishQuiz.mutateAsync(quizId);
    } catch (error) {
      console.error('Failed to publish quiz:', error);
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishQuiz.mutateAsync(quizId);
    } catch (error) {
      console.error('Failed to unpublish quiz:', error);
    }
  };

  const handleAddQuestion = async (data: CreateQuestionData) => {
    try {
      await addQuestion.mutateAsync({ quizId, data });
      setShowQuestionForm(false);
    } catch (error) {
      console.error('Failed to add question:', error);
    }
  };

  const handleUpdateQuestion = async (data: CreateQuestionData) => {
    if (!editingQuestion) return;
    try {
      await updateQuestion.mutateAsync({ quizId, questionId: editingQuestion.id, data });
      setEditingQuestion(null);
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    try {
      await deleteQuestion.mutateAsync({ quizId, questionId });
    } catch (error) {
      console.error('Failed to delete question:', error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/quizzes"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              {quiz.is_published ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircleIcon className="w-3.5 h-3.5 ml-1" />
                  منشور
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <XCircleIcon className="w-3.5 h-3.5 ml-1" />
                  مسودة
                </span>
              )}
            </div>
            {quiz.group && (
              <p className="text-gray-600">{quiz.group.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!quiz.is_published ? (
            <button
              onClick={handlePublish}
              disabled={quiz.questions_count === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              نشر الاختبار
            </button>
          ) : (
            <button
              onClick={handleUnpublish}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              إلغاء النشر
            </button>
          )}
          <Link
            href={`/dashboard/quizzes/${quizId}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <PencilIcon className="w-4 h-4" />
            تعديل
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ClockIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{quiz.duration_minutes}</p>
              <p className="text-sm text-gray-500">دقيقة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <AcademicCapIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{quiz.total_marks}</p>
              <p className="text-sm text-gray-500">درجة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{quiz.completed_attempts_count}</p>
              <p className="text-sm text-gray-500">محاولة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AcademicCapIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {quiz.average_percentage !== undefined && quiz.average_percentage !== null
                  ? `${quiz.average_percentage}%`
                  : '-'}
              </p>
              <p className="text-sm text-gray-500">المتوسط</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Instructions */}
      {(quiz.description || quiz.instructions) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {quiz.description && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">الوصف</h3>
              <p className="text-gray-700">{quiz.description}</p>
            </div>
          )}
          {quiz.instructions && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">التعليمات</h3>
              <p className="text-gray-700">{quiz.instructions}</p>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'questions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الأسئلة ({quiz.questions_count})
          </button>
          <button
            onClick={() => setActiveTab('attempts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'attempts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            المحاولات ({quiz.completed_attempts_count})
          </button>
        </nav>
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Add Question Button */}
          {!showQuestionForm && !editingQuestion && (
            <button
              onClick={() => setShowQuestionForm(true)}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              إضافة سؤال جديد
            </button>
          )}

          {/* Question Form */}
          {(showQuestionForm || editingQuestion) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingQuestion ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
              </h3>
              <QuestionForm
                question={editingQuestion || undefined}
                onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
                onCancel={() => {
                  setShowQuestionForm(false);
                  setEditingQuestion(null);
                }}
                isSubmitting={addQuestion.isPending || updateQuestion.isPending}
              />
            </div>
          )}

          {/* Questions List */}
          {quiz.questions && quiz.questions.length > 0 ? (
            <div className="space-y-4">
              {quiz.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-medium text-sm">
                        {index + 1}
                      </span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {QUESTION_TYPE_LABELS[question.question_type]}
                      </span>
                      <span className="text-xs text-gray-500">{question.marks} درجة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingQuestion(question)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-900 mb-4">{question.question_text}</p>

                  {question.options && question.options.length > 0 && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            option.is_correct
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              option.is_correct
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}
                          />
                          <span className={option.is_correct ? 'text-green-700' : 'text-gray-700'}>
                            {option.option_text}
                          </span>
                          {option.is_correct && (
                            <CheckCircleIcon className="w-4 h-4 text-green-500 mr-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 mb-1">الشرح:</p>
                      <p className="text-sm text-blue-700">{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !showQuestionForm && (
              <div className="text-center py-8 text-gray-500">
                لا توجد أسئلة بعد. أضف سؤالاً للبدء.
              </div>
            )
          )}
        </div>
      )}

      {/* Attempts Tab */}
      {activeTab === 'attempts' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <AttemptsTable attempts={attempts} quizId={quizId} />
        </div>
      )}
    </div>
  );
}
