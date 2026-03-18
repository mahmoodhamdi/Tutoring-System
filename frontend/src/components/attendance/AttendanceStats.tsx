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
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      borderColor: 'border-success-200',
    },
    {
      label: 'غائب',
      value: summary.absent,
      icon: XCircleIcon,
      color: 'text-error-600',
      bgColor: 'bg-error-100',
      borderColor: 'border-error-200',
    },
    {
      label: 'متأخر',
      value: summary.late,
      icon: ClockIcon,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
      borderColor: 'border-accent-200',
    },
    {
      label: 'معذور',
      value: summary.excused,
      icon: ExclamationCircleIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      borderColor: 'border-primary-200',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-neutral-900">إحصائيات الحضور</h3>
        <div className="text-2xl font-extrabold text-primary-600">{attendanceRate}%</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-3 transition-all duration-200`}
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`h-5 w-5 ${stat.color} flex-shrink-0`} />
              <span className="text-sm font-semibold text-neutral-700">{stat.label}</span>
            </div>
            <div className={`mt-1.5 text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
          <span className="font-medium">نسبة الحضور</span>
          <span className="font-semibold text-neutral-800">{summary.present + summary.late} من {summary.total}</span>
        </div>
        <div className="w-full bg-neutral-100 rounded-full h-3">
          <div
            className="bg-gradient-to-l from-success-500 to-success-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default AttendanceStats;
