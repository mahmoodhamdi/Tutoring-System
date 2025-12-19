'use client';

import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface AttendanceStatsProps {
  summary: {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
}

export function AttendanceStats({ summary }: AttendanceStatsProps) {
  const attendanceRate = summary.total > 0
    ? Math.round(((summary.present + summary.late) / summary.total) * 100)
    : 0;

  const stats = [
    {
      label: 'حاضر',
      value: summary.present,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'غائب',
      value: summary.absent,
      icon: XCircleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'متأخر',
      value: summary.late,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'معذور',
      value: summary.excused,
      icon: ExclamationCircleIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">إحصائيات الحضور</h3>
        <div className="text-2xl font-bold text-primary-600">{attendanceRate}%</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bgColor} rounded-lg p-3`}>
            <div className="flex items-center">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="mr-2 text-sm font-medium text-gray-700">{stat.label}</span>
            </div>
            <div className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>نسبة الحضور</span>
          <span>{summary.present + summary.late} من {summary.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default AttendanceStats;
