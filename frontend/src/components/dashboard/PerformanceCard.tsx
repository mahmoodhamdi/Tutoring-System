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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">الأداء الأكاديمي</h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 mb-1">معدل الامتحانات</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">{data.exam_average}%</span>
            <span className="text-xs text-blue-500">(نجاح {data.exam_pass_rate}%)</span>
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700 mb-1">معدل الاختبارات</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-600">{data.quiz_average}%</span>
            <span className="text-xs text-purple-500">(نجاح {data.quiz_pass_rate}%)</span>
          </div>
        </div>
      </div>

      {/* Performance by Group */}
      {data.by_group.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">أداء المجموعات</h4>
          <div className="space-y-2">
            {data.by_group.map((group) => (
              <div key={group.id} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28 truncate">{group.name}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      group.exam_avg >= 80
                        ? 'bg-green-500'
                        : group.exam_avg >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${group.exam_avg}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 w-12 text-left">
                  {group.exam_avg}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Top Performers */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrophyIcon className="w-5 h-5 text-green-600" />
            <h4 className="text-sm font-medium text-green-700">المتفوقون</h4>
          </div>
          {data.top_performers.length > 0 ? (
            <div className="space-y-2">
              {data.top_performers.slice(0, 3).map((student, index) => (
                <Link
                  key={student.id}
                  href={`/dashboard/students/${student.id}`}
                  className="flex items-center justify-between hover:bg-green-100 p-1 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : index === 1
                          ? 'bg-gray-300 text-gray-700'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700 truncate max-w-20">
                      {student.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {student.average}%
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">لا توجد بيانات</p>
          )}
        </div>

        {/* Needs Attention */}
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            <h4 className="text-sm font-medium text-red-700">يحتاجون متابعة</h4>
          </div>
          {data.needs_attention.length > 0 ? (
            <div className="space-y-2">
              {data.needs_attention.slice(0, 3).map((student) => (
                <Link
                  key={student.id}
                  href={`/dashboard/students/${student.id}`}
                  className="flex items-center justify-between hover:bg-red-100 p-1 rounded transition-colors"
                >
                  <span className="text-sm text-gray-700 truncate max-w-24">
                    {student.name}
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    {student.average}%
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">لا يوجد طلاب</p>
          )}
        </div>
      </div>
    </div>
  );
}
