'use client';

import Link from 'next/link';
import { Exam } from '@/types/exam';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import {
  CalendarDaysIcon,
  ClockIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface ExamCardProps {
  exam: Exam;
  showGroup?: boolean;
}

export function ExamCard({ exam, showGroup = true }: ExamCardProps) {
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const typeColors = {
    quiz: 'bg-purple-100 text-purple-800',
    midterm: 'bg-orange-100 text-orange-800',
    final: 'bg-red-100 text-red-800',
    assignment: 'bg-teal-100 text-teal-800',
  };

  return (
    <Link
      href={`/dashboard/exams/${exam.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
          {showGroup && exam.group && (
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <UserGroupIcon className="h-4 w-4 ml-1" />
              {exam.group.name}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[exam.status]}`}
          >
            {exam.status_label}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[exam.exam_type]}`}
          >
            {exam.exam_type_label}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <CalendarDaysIcon className="h-4 w-4 ml-2" />
          {format(new Date(exam.exam_date), 'EEEE d MMMM yyyy', { locale: arSA })}
        </div>
        {exam.start_time && (
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 ml-2" />
            {exam.start_time} - {exam.duration_minutes} دقيقة
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <AcademicCapIcon className="h-4 w-4 ml-2" />
          الدرجة الكلية: {exam.total_marks} | درجة النجاح: {exam.pass_marks || (exam.total_marks * 0.6)}
        </div>
      </div>

      {exam.status === 'completed' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500">المتوسط</p>
              <p className="text-sm font-semibold text-gray-900">
                {exam.average_marks?.toFixed(1) || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">نسبة النجاح</p>
              <p className="text-sm font-semibold text-gray-900">
                {exam.pass_rate ? `${exam.pass_rate}%` : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">تم التصحيح</p>
              <p className="text-sm font-semibold text-gray-900">
                {exam.graded_count}/{exam.results_count}
              </p>
            </div>
          </div>
        </div>
      )}

      {!exam.is_published && (
        <div className="mt-3 px-2 py-1 bg-yellow-50 rounded text-xs text-yellow-700 text-center">
          غير منشور
        </div>
      )}
    </Link>
  );
}

export default ExamCard;
