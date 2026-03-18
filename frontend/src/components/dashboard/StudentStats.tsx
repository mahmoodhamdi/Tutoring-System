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
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-extrabold text-neutral-900">الطلاب</h3>
        <Link
          href="/dashboard/students"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-150"
        >
          عرض الكل
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6 stagger-children">
        <div className="text-center p-3 bg-secondary-50 rounded-xl border border-secondary-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-2xl font-extrabold text-secondary-600">{data.active}</p>
          <p className="text-xs font-semibold text-secondary-700 mt-0.5">نشط</p>
        </div>
        <div className="text-center p-3 bg-neutral-100 rounded-xl border border-neutral-200/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-2xl font-extrabold text-neutral-600">{data.inactive}</p>
          <p className="text-xs font-semibold text-neutral-500 mt-0.5">غير نشط</p>
        </div>
        <div className="text-center p-3 bg-info-50 rounded-xl border border-info-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-2xl font-extrabold text-info-600">{data.new}</p>
          <p className="text-xs font-semibold text-info-600 mt-0.5">جديد</p>
        </div>
      </div>

      {/* By Group */}
      {data.by_group.length > 0 && (
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-neutral-600 mb-3">حسب المجموعة</h4>
          <div className="space-y-2">
            {data.by_group.slice(0, 5).map((group, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors duration-150"
              >
                <div className="p-1.5 bg-primary-50 rounded-lg shrink-0">
                  <UserGroupIcon className="w-4 h-4 text-primary-600" />
                </div>
                <span className="flex-1 text-sm text-neutral-600 truncate">{group.name}</span>
                <span className="text-sm font-semibold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded-lg shrink-0">
                  {group.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* By Grade */}
      {gradeEntries.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-neutral-600 mb-3">حسب المرحلة الدراسية</h4>
          <div className="grid grid-cols-2 gap-2">
            {gradeEntries.slice(0, 6).map(([grade, count]) => (
              <div
                key={grade}
                className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-primary-50/40 hover:border-primary-100 transition-all duration-150"
              >
                <span className="text-xs font-medium text-neutral-600">
                  {GRADE_LEVEL_LABELS[grade] || grade}
                </span>
                <span className="text-sm font-semibold text-neutral-800">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
