'use client';

import { AttendanceStats } from '@/types/dashboard';

interface AttendanceChartProps {
  data: AttendanceStats;
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const maxRate = Math.max(...data.trend.map((t) => t.rate), 100);

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-extrabold text-neutral-900">نسبة الحضور</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-neutral-400">المعدل الحالي:</span>
          <span
            className={`font-extrabold text-base px-2.5 py-0.5 rounded-lg ${
              data.rate >= 80
                ? 'text-secondary-600 bg-secondary-50'
                : data.rate >= 60
                ? 'text-accent-600 bg-accent-50'
                : 'text-error-600 bg-error-50'
            }`}
          >
            {data.rate}%
          </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6 stagger-children">
        <div className="text-center p-3 bg-secondary-50 rounded-xl border border-secondary-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-2xl font-extrabold text-secondary-600">{data.present}</p>
          <p className="text-xs font-semibold text-secondary-700 mt-0.5">حاضر</p>
        </div>
        <div className="text-center p-3 bg-error-50 rounded-xl border border-error-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-2xl font-extrabold text-error-600">{data.absent}</p>
          <p className="text-xs font-semibold text-error-700 mt-0.5">غائب</p>
        </div>
        <div className="text-center p-3 bg-accent-50 rounded-xl border border-accent-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-2xl font-extrabold text-accent-600">{data.late}</p>
          <p className="text-xs font-semibold text-accent-700 mt-0.5">متأخر</p>
        </div>
        <div className="text-center p-3 bg-info-50 rounded-xl border border-info-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-2xl font-extrabold text-info-600">{data.excused}</p>
          <p className="text-xs font-semibold text-info-600 mt-0.5">مستأذن</p>
        </div>
      </div>

      {/* Trend Chart */}
      {data.trend.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-neutral-600 mb-3">تطور نسبة الحضور</h4>
          <div className="flex items-end gap-2 h-32 bg-neutral-50 rounded-xl p-3">
            {data.trend.map((item, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-primary-500 rounded-t-lg transition-all duration-300 hover:bg-primary-600 cursor-default"
                  style={{ height: `${(item.rate / maxRate) * 100}%` }}
                  title={`${item.label}: ${item.rate}%`}
                ></div>
                <span className="text-xs text-neutral-400 truncate w-full text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Attendance Students */}
      {data.low_attendance_students.length > 0 && (
        <div className="mt-6 pt-5 border-t border-neutral-100">
          <h4 className="text-sm font-semibold text-neutral-600 mb-3">طلاب بحاجة لمتابعة الحضور</h4>
          <div className="space-y-2">
            {data.low_attendance_students.slice(0, 5).map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-2.5 bg-error-50 rounded-xl border border-error-100/60 transition-colors duration-150 hover:bg-error-100/60"
              >
                <span className="text-sm font-medium text-neutral-700">{student.name}</span>
                <span className="text-sm font-semibold text-error-600 bg-error-100 px-2 py-0.5 rounded-lg">
                  {student.rate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
