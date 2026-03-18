'use client';

import { usePortalAttendance } from '@/hooks/usePortal';
import { PORTAL_ATTENDANCE_STATUS_LABELS } from '@/types/portal';
import type { PortalAttendanceItem } from '@/types/portal';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function PortalAttendancePage() {
  const { data, isLoading, error } = usePortalAttendance();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
          <p className="text-neutral-500 text-sm">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-error-50 rounded-2xl mb-3">
          <ExclamationTriangleIcon className="w-7 h-7 text-error-500" />
        </div>
        <p className="text-error-600 font-semibold">حدث خطأ في تحميل البيانات</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="w-4 h-4 text-success-600" />;
      case 'absent':
        return <XCircleIcon className="w-4 h-4 text-error-600" />;
      case 'late':
        return <ClockIcon className="w-4 h-4 text-warning-600" />;
      case 'excused':
        return <DocumentCheckIcon className="w-4 h-4 text-info-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-success-100 text-success-700';
      case 'absent':
        return 'bg-error-100 text-error-700';
      case 'late':
        return 'bg-warning-100 text-warning-700';
      case 'excused':
        return 'bg-info-100 text-info-600';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">سجل الحضور</h1>
        <p className="text-neutral-500 text-sm mt-1">سجل حضورك في الجلسات</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
        {/* Total */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-neutral-100 text-neutral-600">
              <ClipboardDocumentListIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-neutral-900">{data.summary.total}</p>
              <p className="text-xs text-neutral-500 mt-0.5">إجمالي</p>
            </div>
          </div>
        </div>

        {/* Present */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success-50 text-success-600">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-success-600">{data.summary.present}</p>
              <p className="text-xs text-neutral-500 mt-0.5">حاضر</p>
            </div>
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-error-50 text-error-600">
              <XCircleIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-error-600">{data.summary.absent}</p>
              <p className="text-xs text-neutral-500 mt-0.5">غائب</p>
            </div>
          </div>
        </div>

        {/* Late */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning-50 text-warning-600">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-warning-600">{data.summary.late}</p>
              <p className="text-xs text-neutral-500 mt-0.5">متأخر</p>
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                data.summary.rate >= 80
                  ? 'bg-success-50 text-success-600'
                  : data.summary.rate >= 60
                  ? 'bg-warning-50 text-warning-600'
                  : 'bg-error-50 text-error-600'
              }`}
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-neutral-900">{data.summary.rate}%</p>
              <p className="text-xs text-neutral-500 mt-0.5">نسبة الحضور</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <h2 className="text-base font-bold text-neutral-900 mb-5">سجل الحضور</h2>
        {data.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-neutral-100">
                  <th className="text-right py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    الجلسة
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    الوقت
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {data.data.map((record: PortalAttendanceItem) => (
                  <tr
                    key={record.id}
                    className="hover:bg-neutral-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-neutral-900">{record.session?.title}</p>
                      {record.session?.group && (
                        <p className="text-xs text-neutral-400 mt-0.5">{record.session.group.name}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center text-neutral-600 text-sm">
                      {record.session?.session_date}
                    </td>
                    <td className="py-3.5 px-4 text-center text-neutral-500 text-sm">
                      {record.session?.start_time?.substring(0, 5)} -{' '}
                      {record.session?.end_time?.substring(0, 5)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {getStatusIcon(record.status)}
                        {PORTAL_ATTENDANCE_STATUS_LABELS[record.status] || record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-neutral-400">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-50 rounded-2xl mb-3">
              <ClipboardDocumentListIcon className="w-7 h-7 text-neutral-300" />
            </div>
            <p className="text-sm">لا توجد سجلات حضور</p>
          </div>
        )}
      </div>
    </div>
  );
}
