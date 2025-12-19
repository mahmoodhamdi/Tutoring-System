'use client';

import { AttendanceStats } from '@/types/dashboard';

interface AttendanceChartProps {
  data: AttendanceStats;
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const maxRate = Math.max(...data.trend.map((t) => t.rate), 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">نسبة الحضور</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">المعدل الحالي:</span>
          <span
            className={`font-bold ${
              data.rate >= 80
                ? 'text-green-600'
                : data.rate >= 60
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {data.rate}%
          </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{data.present}</p>
          <p className="text-xs text-green-700">حاضر</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{data.absent}</p>
          <p className="text-xs text-red-700">غائب</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{data.late}</p>
          <p className="text-xs text-yellow-700">متأخر</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{data.excused}</p>
          <p className="text-xs text-blue-700">مستأذن</p>
        </div>
      </div>

      {/* Trend Chart */}
      {data.trend.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">تطور نسبة الحضور</h4>
          <div className="flex items-end gap-2 h-32">
            {data.trend.map((item, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
                  style={{ height: `${(item.rate / maxRate) * 100}%` }}
                  title={`${item.label}: ${item.rate}%`}
                ></div>
                <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Attendance Students */}
      {data.low_attendance_students.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">طلاب بحاجة لمتابعة الحضور</h4>
          <div className="space-y-2">
            {data.low_attendance_students.slice(0, 5).map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-2 bg-red-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{student.name}</span>
                <span className="text-sm font-medium text-red-600">{student.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
