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
} from '@heroicons/react/24/outline';

export default function PortalDashboardPage() {
  const { data, isLoading, error } = usePortalDashboard();

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-l from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-6 text-white shadow-[0_8px_24px_rgba(79,70,229,0.25)]">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-12 w-32 h-32 bg-secondary-400/20 rounded-full translate-y-1/2 blur-2xl pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-extrabold">مرحباً، {data.student.name}</h1>
          <p className="text-primary-200 mt-1 text-sm">هذه نظرة عامة على حالتك الدراسية</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {/* Attendance Rate */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                data.attendance.rate >= 80
                  ? 'bg-success-50 text-success-600'
                  : data.attendance.rate >= 60
                  ? 'bg-warning-50 text-warning-600'
                  : 'bg-error-50 text-error-600'
              }`}
            >
              <ClipboardDocumentListIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-neutral-900">{data.attendance.rate}%</p>
              <p className="text-xs text-neutral-500 mt-0.5">نسبة الحضور</p>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                data.payments.pending_amount > 0
                  ? 'bg-warning-50 text-warning-600'
                  : 'bg-success-50 text-success-600'
              }`}
            >
              <BanknotesIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-neutral-900">
                {formatCurrency(data.payments.pending_amount)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">مستحقات معلقة</p>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-info-50 text-info-600">
              <CalendarDaysIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-neutral-900">{data.upcoming_sessions.length}</p>
              <p className="text-xs text-neutral-500 mt-0.5">جلسات قادمة</p>
            </div>
          </div>
        </div>

        {/* Overdue Payments Warning */}
        {data.payments.overdue_count > 0 && (
          <div className="bg-error-50 rounded-2xl border border-error-100 p-4 card-hover">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-error-100 text-error-600">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-error-700">{data.payments.overdue_count}</p>
                <p className="text-xs text-error-600 mt-0.5">مدفوعات متأخرة</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-neutral-900">الجلسات القادمة</h2>
            <Link
              href="/portal/schedule"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              عرض الكل
            </Link>
          </div>
          {data.upcoming_sessions.length > 0 ? (
            <div className="space-y-2.5">
              {data.upcoming_sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-primary-50/50 hover:border-primary-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm">{session.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{session.group_name}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-neutral-700">{session.session_date}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {(session.start_time || '--:--').substring(0, 5)} - {(session.end_time || '--:--').substring(0, 5)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-50 rounded-2xl mb-3">
                <CalendarDaysIcon className="w-7 h-7 text-neutral-300" />
              </div>
              <p className="text-sm">لا توجد جلسات قادمة</p>
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-neutral-900">آخر النتائج</h2>
            <Link
              href="/portal/grades"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              عرض الكل
            </Link>
          </div>
          {data.recent_results.length > 0 ? (
            <div className="space-y-2.5">
              {data.recent_results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-neutral-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${
                        result.is_passed ? 'bg-success-100 text-success-600' : 'bg-error-100 text-error-600'
                      }`}
                    >
                      {result.is_passed ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <ExclamationTriangleIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 text-sm">{result.exam_title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{result.exam_date}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-lg font-extrabold ${
                        result.is_passed ? 'text-success-600' : 'text-error-600'
                      }`}
                    >
                      {result.percentage}%
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {result.obtained_marks}/{result.total_marks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-50 rounded-2xl mb-3">
                <AcademicCapIcon className="w-7 h-7 text-neutral-300" />
              </div>
              <p className="text-sm">لا توجد نتائج حديثة</p>
            </div>
          )}
        </div>
      </div>

      {/* Announcements */}
      {data.announcements.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-neutral-900">أحدث الإعلانات</h2>
            <Link
              href="/portal/announcements"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              عرض الكل
            </Link>
          </div>
          <div className="space-y-2.5">
            {data.announcements.map((announcement) => (
              <Link
                key={announcement.id}
                href={`/portal/announcements/${announcement.id}`}
                className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-primary-50/40 hover:border-primary-100 transition-all duration-200 group"
              >
                <div
                  className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${
                    announcement.priority === 'high'
                      ? 'bg-error-50 text-error-500'
                      : announcement.priority === 'medium'
                      ? 'bg-warning-50 text-warning-600'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  <MegaphoneIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-neutral-900 text-sm group-hover:text-primary-700 transition-colors">
                      {announcement.title}
                    </p>
                    {announcement.is_pinned && (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                        مثبت
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    {new Date(announcement.created_at).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
