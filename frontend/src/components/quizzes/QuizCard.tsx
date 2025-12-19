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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link
              href={`/dashboard/quizzes/${quiz.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {quiz.title}
            </Link>
            {quiz.group && (
              <p className="text-sm text-gray-500 mt-1">{quiz.group.name}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
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
        </div>

        {/* Description */}
        {quiz.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {quiz.description}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClipboardDocumentListIcon className="w-4 h-4 text-gray-400" />
            <span>{quiz.questions_count} سؤال</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4 text-gray-400" />
            <span>{quiz.duration_minutes} دقيقة</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AcademicCapIcon className="w-4 h-4 text-gray-400" />
            <span>{quiz.total_marks} درجة</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UsersIcon className="w-4 h-4 text-gray-400" />
            <span>{quiz.completed_attempts_count} محاولة</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
          <span>نسبة النجاح: {quiz.pass_percentage}%</span>
          <span>•</span>
          <span>الحد الأقصى: {quiz.max_attempts} محاولات</span>
          {quiz.average_percentage !== undefined && quiz.average_percentage !== null && (
            <>
              <span>•</span>
              <span>المتوسط: {quiz.average_percentage}%</span>
            </>
          )}
        </div>

        {/* Availability */}
        {(quiz.available_from || quiz.available_until) && (
          <div className="text-xs text-gray-500 mb-4">
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
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <Link
              href={`/dashboard/quizzes/${quiz.id}`}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              عرض
            </Link>
            <Link
              href={`/dashboard/quizzes/${quiz.id}/edit`}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              تعديل
            </Link>
            {!quiz.is_published && onPublish && (
              <button
                onClick={() => onPublish(quiz.id)}
                className="text-sm text-green-600 hover:text-green-700"
              >
                نشر
              </button>
            )}
            {quiz.is_published && onUnpublish && (
              <button
                onClick={() => onUnpublish(quiz.id)}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                إلغاء النشر
              </button>
            )}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(quiz.id)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                نسخ
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(quiz.id)}
                className="text-sm text-red-600 hover:text-red-700 mr-auto"
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
