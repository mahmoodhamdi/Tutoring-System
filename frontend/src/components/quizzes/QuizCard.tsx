'use client';

import Link from 'next/link';
import { Quiz } from '@/types/quiz';
import { formatDate } from '@/lib/utils';
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  AcademicCapIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface QuizCardProps {
  quiz: Quiz;
  onPublish?: (id: number) => void;
  onUnpublish?: (id: number) => void;
  onDuplicate?: (id: number) => void;
  onDelete?: (id: number) => void;
  isTeacher?: boolean;
}

export function QuizCard({
  quiz,
  onPublish,
  onUnpublish,
  onDuplicate,
  onDelete,
  isTeacher = true,
}: QuizCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <Link
              href={`/dashboard/quizzes/${quiz.id}`}
              className="text-base font-bold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-1"
            >
              {quiz.title}
            </Link>
            {quiz.group && (
              <p className="text-sm text-neutral-500 mt-0.5">{quiz.group.name}</p>
            )}
          </div>
          <div className="mr-2 flex-shrink-0">
            {quiz.is_published ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-100 text-success-700">
                <CheckCircleIcon className="w-3.5 h-3.5 ml-1" />
                منشور
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600">
                <XCircleIcon className="w-3.5 h-3.5 ml-1" />
                مسودة
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {quiz.description && (
          <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
            {quiz.description}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 rounded-xl px-3 py-2">
            <ClipboardDocumentListIcon className="w-4 h-4 text-primary-400 flex-shrink-0" />
            <span>{quiz.questions_count} سؤال</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 rounded-xl px-3 py-2">
            <ClockIcon className="w-4 h-4 text-secondary-400 flex-shrink-0" />
            <span>{quiz.duration_minutes} دقيقة</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 rounded-xl px-3 py-2">
            <AcademicCapIcon className="w-4 h-4 text-accent-400 flex-shrink-0" />
            <span>{quiz.total_marks} درجة</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 rounded-xl px-3 py-2">
            <UsersIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            <span>{quiz.completed_attempts_count} محاولة</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex flex-wrap gap-2 text-xs text-neutral-500 mb-4">
          <span className="bg-neutral-50 px-2 py-0.5 rounded-lg">نسبة النجاح: {quiz.pass_percentage}%</span>
          <span className="bg-neutral-50 px-2 py-0.5 rounded-lg">الحد الأقصى: {quiz.max_attempts} محاولات</span>
          {quiz.average_percentage !== undefined && quiz.average_percentage !== null && (
            <span className="bg-neutral-50 px-2 py-0.5 rounded-lg">المتوسط: {quiz.average_percentage}%</span>
          )}
        </div>

        {/* Availability */}
        {(quiz.available_from || quiz.available_until) && (
          <div className="text-xs text-neutral-500 mb-4 bg-primary-50 px-3 py-2 rounded-xl border border-primary-100">
            {quiz.available_from && (
              <span>متاح من: {formatDate(quiz.available_from)}</span>
            )}
            {quiz.available_from && quiz.available_until && <span> - </span>}
            {quiz.available_until && (
              <span>حتى: {formatDate(quiz.available_until)}</span>
            )}
          </div>
        )}

        {/* Actions */}
        {isTeacher && (
          <div className="flex items-center gap-2 pt-4 border-t border-neutral-100 flex-wrap">
            <Link
              href={`/dashboard/quizzes/${quiz.id}`}
              className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              عرض
            </Link>
            <Link
              href={`/dashboard/quizzes/${quiz.id}/edit`}
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              تعديل
            </Link>
            {!quiz.is_published && onPublish && (
              <button
                onClick={() => onPublish(quiz.id)}
                className="text-sm text-success-600 hover:text-success-700 transition-colors"
              >
                نشر
              </button>
            )}
            {quiz.is_published && onUnpublish && (
              <button
                onClick={() => onUnpublish(quiz.id)}
                className="text-sm text-accent-600 hover:text-accent-700 transition-colors"
              >
                إلغاء النشر
              </button>
            )}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(quiz.id)}
                className="text-sm text-secondary-600 hover:text-secondary-700 transition-colors"
              >
                نسخ
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(quiz.id)}
                className="text-sm text-error-600 hover:text-error-700 mr-auto transition-colors"
              >
                حذف
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
