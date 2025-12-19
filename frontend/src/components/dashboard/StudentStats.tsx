'use client';

import Link from 'next/link';
import { StudentStats as StudentStatsType } from '@/types/dashboard';
import { GRADE_LEVEL_LABELS } from '@/types/dashboard';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface StudentStatsProps {
  data: StudentStatsType;
}

export function StudentStats({ data }: StudentStatsProps) {
  const gradeEntries = Object.entries(data.by_grade || {}).sort(([a], [b]) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">الطلاب</h3>
        <Link
          href="/dashboard/students"
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          عرض الكل
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{data.active}</p>
          <p className="text-xs text-green-700">نشط</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-600">{data.inactive}</p>
          <p className="text-xs text-gray-700">غير نشط</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{data.new}</p>
          <p className="text-xs text-blue-700">جديد</p>
        </div>
      </div>

      {/* By Group */}
      {data.by_group.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">حسب المجموعة</h4>
          <div className="space-y-2">
            {data.by_group.slice(0, 5).map((group, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-1.5 bg-primary-50 rounded">
                  <UserGroupIcon className="w-4 h-4 text-primary-600" />
                </div>
                <span className="flex-1 text-sm text-gray-600 truncate">{group.name}</span>
                <span className="text-sm font-medium text-gray-900">{group.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* By Grade */}
      {gradeEntries.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">حسب المرحلة الدراسية</h4>
          <div className="grid grid-cols-2 gap-2">
            {gradeEntries.slice(0, 6).map(([grade, count]) => (
              <div
                key={grade}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-xs text-gray-600">
                  {GRADE_LEVEL_LABELS[grade] || grade}
                </span>
                <span className="text-sm font-medium text-gray-900">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
