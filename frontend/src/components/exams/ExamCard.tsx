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
    scheduled: 'bg-primary-100 text-primary-700',
    in_progress: 'bg-accent-100 text-accent-700',
    completed: 'bg-success-100 text-success-700',
    cancelled: 'bg-error-100 text-error-700',
  };

  const typeColors = {
    quiz: 'bg-secondary-100 text-secondary-700',
    midterm: 'bg-accent-100 text-accent-700',
    final: 'bg-error-100 text-error-700',
    assignment: 'bg-success-100 text-success-700',
  };

  return (
    <Link
      href={`/dashboard/exams/${exam.id}`}
      className="block bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-neutral-900 truncate">{exam.title}</h3>
          {showGroup && exam.group && (
            <div className="flex items-center mt-1 text-sm text-neutral-500">
              <UserGroupIcon className="h-4 w-4 ml-1 text-neutral-400 flex-shrink-0" />
              {exam.group.name}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 mr-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[exam.status]}`}
          >
            {exam.status_label}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeColors[exam.exam_type]}`}
          >
            {exam.exam_type_label}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-neutral-600">
          <CalendarDaysIcon className="h-4 w-4 ml-2 text-primary-400 flex-shrink-0" />
          {format(new Date(exam.exam_date), 'EEEE d MMMM yyyy', { locale: arSA })}
        </div>
        {exam.start_time && (
          <div className="flex items-center text-sm text-neutral-600">
            <ClockIcon className="h-4 w-4 ml-2 text-secondary-400 flex-shrink-0" />
            {exam.start_time} - {exam.duration_minutes} دقيقة
          </div>
        )}
        <div className="flex items-center text-sm text-neutral-600">
          <AcademicCapIcon className="h-4 w-4 ml-2 text-accent-400 flex-shrink-0" />
          الدرجة الكلية: {exam.total_marks} | درجة النجاح: {exam.pass_marks || (exam.total_marks * 0.6)}
        </div>
      </div>

      {exam.status === 'completed' && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-neutral-50 rounded-xl py-2 px-1">
              <p className="text-xs text-neutral-400">المتوسط</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">
                {exam.average_marks?.toFixed(1) || '-'}
              </p>
            </div>
            <div className="bg-neutral-50 rounded-xl py-2 px-1">
              <p className="text-xs text-neutral-400">نسبة النجاح</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">
                {exam.pass_rate ? `${exam.pass_rate}%` : '-'}
              </p>
            </div>
            <div className="bg-neutral-50 rounded-xl py-2 px-1">
              <p className="text-xs text-neutral-400">تم التصحيح</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">
                {exam.graded_count}/{exam.results_count}
              </p>
            </div>
          </div>
        </div>
      )}

      {!exam.is_published && (
        <div className="mt-3 px-3 py-1.5 bg-accent-50 rounded-xl text-xs font-semibold text-accent-700 text-center border border-accent-100">
          غير منشور
        </div>
      )}
    </Link>
  );
}

export default ExamCard;
