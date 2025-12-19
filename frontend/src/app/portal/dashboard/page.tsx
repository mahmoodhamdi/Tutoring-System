'use client';

import Link from 'next/link';
import { usePortalDashboard } from '@/hooks/usePortal';
import { formatCurrency } from '@/lib/utils';
import {
  ClipboardDocumentListIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  MegaphoneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function PortalDashboardPage() {
  const { data, isLoading, error } = usePortalDashboard();

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

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-l from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">مرحباً، {data.student.name}</h1>
        <p className="text-primary-100 mt-1">هذه نظرة عامة على حالتك الدراسية</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                data.attendance.rate >= 80
                  ? 'bg-green-50 text-green-600'
                  : data.attendance.rate >= 60
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <ClipboardDocumentListIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.attendance.rate}%</p>
              <p className="text-sm text-gray-500">نسبة الحضور</p>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                data.payments.pending_amount > 0
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'bg-green-50 text-green-600'
              }`}
            >
              <BanknotesIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(data.payments.pending_amount)}
              </p>
              <p className="text-sm text-gray-500">مستحقات معلقة</p>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <CalendarDaysIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.upcoming_sessions.length}</p>
              <p className="text-sm text-gray-500">جلسات قادمة</p>
            </div>
          </div>
        </div>

        {/* Overdue Payments Warning */}
        {data.payments.overdue_count > 0 && (
          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl font-bold text-red-700">{data.payments.overdue_count}</p>
                <p className="text-sm text-red-600">مدفوعات متأخرة</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">الجلسات القادمة</h2>
            <Link href="/portal/schedule" className="text-sm text-primary-600 hover:text-primary-700">
              عرض الكل
            </Link>
          </div>
          {data.upcoming_sessions.length > 0 ? (
            <div className="space-y-3">
              {data.upcoming_sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{session.title}</p>
                    <p className="text-sm text-gray-500">{session.group_name}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{session.session_date}</p>
                    <p className="text-xs text-gray-500">
                      {session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <CalendarDaysIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>لا توجد جلسات قادمة</p>
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">آخر النتائج</h2>
            <Link href="/portal/grades" className="text-sm text-primary-600 hover:text-primary-700">
              عرض الكل
            </Link>
          </div>
          {data.recent_results.length > 0 ? (
            <div className="space-y-3">
              {data.recent_results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        result.is_passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {result.is_passed ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <ExclamationTriangleIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{result.exam_title}</p>
                      <p className="text-xs text-gray-500">{result.exam_date}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-lg font-bold ${
                        result.is_passed ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {result.percentage}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.obtained_marks}/{result.total_marks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <AcademicCapIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>لا توجد نتائج حديثة</p>
            </div>
          )}
        </div>
      </div>

      {/* Announcements */}
      {data.announcements.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">أحدث الإعلانات</h2>
            <Link
              href="/portal/announcements"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {data.announcements.map((announcement) => (
              <Link
                key={announcement.id}
                href={`/portal/announcements/${announcement.id}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <MegaphoneIcon
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      announcement.priority === 'high'
                        ? 'text-red-500'
                        : announcement.priority === 'medium'
                        ? 'text-yellow-500'
                        : 'text-gray-400'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{announcement.title}</p>
                      {announcement.is_pinned && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                          مثبت
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(announcement.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
