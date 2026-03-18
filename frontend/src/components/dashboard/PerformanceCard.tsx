'use client';

import Link from 'next/link';
import { PerformanceStats } from '@/types/dashboard';
import {
  TrophyIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface PerformanceCardProps {
  data: PerformanceStats;
}

export function PerformanceCard({ data }: PerformanceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 animate-fade-in">
      <h3 className="text-lg font-extrabold text-neutral-900 mb-6">الأداء الأكاديمي</h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 stagger-children">
        <div className="p-4 bg-primary-50 rounded-xl border border-primary-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-sm font-semibold text-primary-700 mb-1">معدل الامتحانات</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-primary-600">{data.exam_average}%</span>
            <span className="text-xs text-primary-400">(نجاح {data.exam_pass_rate}%)</span>
          </div>
        </div>
        <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-sm font-semibold text-secondary-700 mb-1">معدل الاختبارات</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-secondary-600">{data.quiz_average}%</span>
            <span className="text-xs text-secondary-400">(نجاح {data.quiz_pass_rate}%)</span>
          </div>
        </div>
      </div>

      {/* Performance by Group */}
      {data.by_group.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-neutral-600 mb-3">أداء المجموعات</h4>
          <div className="space-y-2.5">
            {data.by_group.map((group) => (
              <div key={group.id} className="flex items-center gap-3">
                <span className="text-sm text-neutral-600 w-28 truncate shrink-0">{group.name}</span>
                <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      group.exam_avg >= 80
                        ? 'bg-secondary-500'
                        : group.exam_avg >= 60
                        ? 'bg-accent-500'
                        : 'bg-error-500'
                    }`}
                    style={{ width: `${group.exam_avg}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-neutral-700 w-12 text-right shrink-0">
                  {group.exam_avg}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Top Performers */}
        <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-100/60">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-secondary-100 rounded-lg">
              <TrophyIcon className="w-4 h-4 text-secondary-600" />
            </div>
            <h4 className="text-sm font-semibold text-secondary-700">المتفوقون</h4>
          </div>
          {data.top_performers.length > 0 ? (
            <div className="space-y-2">
              {data.top_performers.slice(0, 3).map((student, index) => (
                <Link
                  key={student.id}
                  href={`/dashboard/students/${student.id}`}
                  className="flex items-center justify-between hover:bg-secondary-100/60 p-1.5 rounded-lg transition-colors duration-150 group"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                        index === 0
                          ? 'bg-accent-400 text-accent-900'
                          : index === 1
                          ? 'bg-neutral-300 text-neutral-700'
                          : 'bg-accent-600 text-white'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm text-neutral-700 truncate max-w-20 group-hover:text-neutral-900 transition-colors">
                      {student.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-secondary-600 shrink-0">
                    {student.average}%
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">لا توجد بيانات</p>
          )}
        </div>

        {/* Needs Attention */}
        <div className="p-4 bg-error-50 rounded-xl border border-error-100/60">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-error-100 rounded-lg">
              <ExclamationTriangleIcon className="w-4 h-4 text-error-600" />
            </div>
            <h4 className="text-sm font-semibold text-error-700">يحتاجون متابعة</h4>
          </div>
          {data.needs_attention.length > 0 ? (
            <div className="space-y-2">
              {data.needs_attention.slice(0, 3).map((student) => (
                <Link
                  key={student.id}
                  href={`/dashboard/students/${student.id}`}
                  className="flex items-center justify-between hover:bg-error-100/60 p-1.5 rounded-lg transition-colors duration-150 group"
                >
                  <span className="text-sm text-neutral-700 truncate max-w-24 group-hover:text-neutral-900 transition-colors">
                    {student.name}
                  </span>
                  <span className="text-sm font-semibold text-error-600 shrink-0">
                    {student.average}%
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">لا يوجد طلاب</p>
          )}
        </div>
      </div>
    </div>
  );
}
