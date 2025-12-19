'use client';

import { usePortalAttendance } from '@/hooks/usePortal';
import { PORTAL_ATTENDANCE_STATUS_LABELS } from '@/types/portal';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';

export default function PortalAttendancePage() {
  const { data, isLoading, error } = usePortalAttendance();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">حدث خطأ في تحميل البيانات</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'absent':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'late':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'excused':
        return <DocumentCheckIcon className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700';
      case 'absent':
        return 'bg-red-100 text-red-700';
      case 'late':
        return 'bg-yellow-100 text-yellow-700';
      case 'excused':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">سجل الحضور</h1>
        <p className="text-gray-600">سجل حضورك في الجلسات</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gray-50 text-gray-600">
              <ClipboardDocumentListIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.total}</p>
              <p className="text-sm text-gray-500">إجمالي</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{data.summary.present}</p>
              <p className="text-sm text-gray-500">حاضر</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-50 text-red-600">
              <XCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{data.summary.absent}</p>
              <p className="text-sm text-gray-500">غائب</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
              <ClockIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{data.summary.late}</p>
              <p className="text-sm text-gray-500">متأخر</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                data.summary.rate >= 80
                  ? 'bg-green-50 text-green-600'
                  : data.summary.rate >= 60
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <ClipboardDocumentListIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.rate}%</p>
              <p className="text-sm text-gray-500">نسبة الحضور</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">سجل الحضور</h2>
        {data.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الجلسة</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">التاريخ</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">الوقت</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((record: any) => (
                  <tr key={record.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{record.session?.title}</p>
                      {record.session?.group && (
                        <p className="text-xs text-gray-500">{record.session.group.name}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {record.session?.session_date}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {record.session?.start_time?.substring(0, 5)} -{' '}
                      {record.session?.end_time?.substring(0, 5)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
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
          <div className="text-center py-8 text-gray-500">
            <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>لا توجد سجلات حضور</p>
          </div>
        )}
      </div>
    </div>
  );
}
