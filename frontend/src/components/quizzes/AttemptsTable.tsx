'use client';

import Link from 'next/link';
import { QuizAttempt, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS } from '@/types/quiz';
import { formatDate } from '@/lib/utils';
import { EyeIcon } from '@heroicons/react/24/outline';

interface AttemptsTableProps {
  attempts: QuizAttempt[];
  quizId: number;
  showStudent?: boolean;
}

export function AttemptsTable({ attempts, quizId, showStudent = true }: AttemptsTableProps) {
  if (attempts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد محاولات حتى الآن
      </div>
    );
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showStudent && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الطالب
              </th>
            )}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              تاريخ البدء
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الحالة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الدرجة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              النسبة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الوقت
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              النتيجة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              إجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {attempts.map((attempt) => (
            <tr key={attempt.id} className="hover:bg-gray-50">
              {showStudent && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {attempt.student?.name || 'غير معروف'}
                  </div>
                  <div className="text-sm text-gray-500">{attempt.student?.email}</div>
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(attempt.started_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${ATTEMPT_STATUS_COLORS[attempt.status]}`}>
                  {ATTEMPT_STATUS_LABELS[attempt.status]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {attempt.status === 'completed' || attempt.status === 'timed_out' ? (
                  <>
                    {attempt.score?.toFixed(1)} / {attempt.quiz?.total_marks || '-'}
                  </>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {attempt.percentage !== undefined && attempt.percentage !== null
                  ? `${attempt.percentage.toFixed(1)}%`
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDuration(attempt.time_taken_seconds)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {attempt.is_passed !== null && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    attempt.is_passed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {attempt.is_passed ? 'ناجح' : 'راسب'}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={`/dashboard/quizzes/${quizId}/attempts/${attempt.id}`}
                  className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700"
                >
                  <EyeIcon className="w-4 h-4" />
                  عرض
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
