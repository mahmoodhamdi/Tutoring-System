'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useSession,
  useDeleteSession,
  useCancelSession,
  useCompleteSession,
} from '@/hooks/useSessions';
import { useSessionAttendance, useRecordAttendance } from '@/hooks/useAttendance';
import type { AttendanceStatus } from '@/types/attendance';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AttendanceForm } from '@/components/attendance';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default function SessionPage({ params }: SessionPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const sessionId = parseInt(id, 10);

  const { data: session, isLoading, isError, error } = useSession(sessionId);
  const { data: attendanceData, isLoading: attendanceLoading } = useSessionAttendance(sessionId);

  const deleteSession = useDeleteSession();
  const cancelSession = useCancelSession();
  const completeSession = useCompleteSession();
  const recordAttendance = useRecordAttendance();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذه الجلسة؟')) {
      try {
        await deleteSession.mutateAsync(sessionId);
        router.push('/dashboard/schedule');
      } catch {
        // Error is handled by the mutation
      }
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSession.mutateAsync({
        id: sessionId,
        data: { reason: cancelReason },
      });
      setShowCancelModal(false);
      setCancelReason('');
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleComplete = async () => {
    try {
      await completeSession.mutateAsync(sessionId);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleRecordAttendance = async (attendances: { student_id: number; status: AttendanceStatus; notes?: string }[]) => {
    try {
      await recordAttendance.mutateAsync({
        sessionId,
        data: { attendances },
      });
    } catch {
      // Error is handled by the mutation
    }
  };

  const statusColors: Record<string, string> = {
    scheduled: 'bg-primary-100 text-primary-800',
    completed: 'bg-secondary-100 text-secondary-800',
    cancelled: 'bg-error-100 text-error-800',
  };

  const statusLabels: Record<string, string> = {
    scheduled: 'مجدولة',
    completed: 'مكتملة',
    cancelled: 'ملغاة',
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-100 rounded-xl w-1/4 mb-4" />
          <div className="h-64 bg-neutral-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="error">
          {(error as Error)?.message || 'فشل في تحميل بيانات الجلسة'}
        </Alert>
      </div>
    );
  }

  if (!session?.data) {
    return (
      <div className="p-6">
        <Alert variant="error">الجلسة غير موجودة</Alert>
      </div>
    );
  }

  const sessionData = session.data;

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <Link href="/dashboard" className="hover:text-neutral-700 transition-colors">
            لوحة التحكم
          </Link>
          <span className="text-neutral-300">/</span>
          <Link href="/dashboard/schedule" className="hover:text-neutral-700 transition-colors">
            الجدول
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-semibold">{sessionData.title}</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900">{sessionData.title}</h1>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mt-2 ${
                statusColors[sessionData.status]
              }`}
            >
              {statusLabels[sessionData.status]}
            </span>
          </div>
          <div className="flex gap-2">
            {sessionData.status === 'scheduled' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(true)}
                  className="text-error-600 border-error-300 hover:bg-error-50"
                >
                  <XCircleIcon className="w-4 h-4 ml-2" />
                  إلغاء
                </Button>
                <Button onClick={handleComplete} isLoading={completeSession.isPending}>
                  <CheckCircleIcon className="w-4 h-4 ml-2" />
                  إكمال
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={handleDelete}
              isLoading={deleteSession.isPending}
              className="text-error-600 border-error-300 hover:bg-error-50"
            >
              حذف
            </Button>
          </div>
        </div>
      </div>

      {/* Session Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">تفاصيل الجلسة</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-5 w-5 text-neutral-400 ml-2" />
                <div>
                  <p className="text-sm text-neutral-500">التاريخ</p>
                  <p className="font-semibold text-neutral-900">
                    {sessionData.scheduled_at
                      ? format(new Date(sessionData.scheduled_at), 'd MMMM yyyy', { locale: arSA })
                      : sessionData.session_date
                        ? format(new Date(sessionData.session_date + 'T00:00:00'), 'd MMMM yyyy', { locale: arSA })
                        : '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-neutral-400 ml-2" />
                <div>
                  <p className="text-sm text-neutral-500">الوقت</p>
                  <p className="font-semibold text-neutral-900">
                    {sessionData.scheduled_at
                      ? format(new Date(sessionData.scheduled_at), 'h:mm a', { locale: arSA })
                      : sessionData.start_time
                        ? sessionData.start_time.substring(0, 5)
                        : '--:--'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-neutral-400 ml-2" />
                <div>
                  <p className="text-sm text-neutral-500">المدة</p>
                  <p className="font-semibold text-neutral-900">{sessionData.duration_minutes} دقيقة</p>
                </div>
              </div>

              {sessionData.location && (
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-neutral-400 ml-2" />
                  <div>
                    <p className="text-sm text-neutral-500">المكان</p>
                    <p className="font-semibold text-neutral-900">{sessionData.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-neutral-400 ml-2" />
                <div>
                  <p className="text-sm text-neutral-500">المجموعة</p>
                  <p className="font-semibold text-neutral-900">{sessionData.group?.name}</p>
                </div>
              </div>
            </div>

            {sessionData.description && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-sm text-neutral-500">الوصف</p>
                <p className="mt-1 text-neutral-700">{sessionData.description}</p>
              </div>
            )}

            {sessionData.notes && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-sm text-neutral-500">ملاحظات</p>
                <p className="mt-1 text-neutral-700">{sessionData.notes}</p>
              </div>
            )}

            {sessionData.status === 'cancelled' && sessionData.cancellation_reason && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-sm text-error-500">سبب الإلغاء</p>
                <p className="mt-1 text-error-700">{sessionData.cancellation_reason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">الحضور</h2>

            {attendanceLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-neutral-100 rounded-xl" />
                ))}
              </div>
            ) : sessionData.status === 'scheduled' ? (
              attendanceData?.attendances?.length ? (
                <AttendanceForm
                  attendances={attendanceData.attendances}
                  onSubmit={handleRecordAttendance}
                  isSubmitting={recordAttendance.isPending}
                />
              ) : (
                <p className="text-neutral-500 text-sm">لا يوجد طلاب في هذه المجموعة</p>
              )
            ) : (
              <div className="space-y-2">
                {attendanceData?.attendances?.map((attendance) => (
                  <div
                    key={attendance.student_id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl"
                  >
                    <span className="font-semibold text-neutral-900">{attendance.student_name}</span>
                    <span
                      className={`text-sm font-medium ${
                        attendance.status === 'present'
                          ? 'text-secondary-600'
                          : attendance.status === 'absent'
                          ? 'text-error-600'
                          : attendance.status === 'late'
                          ? 'text-warning-600'
                          : 'text-neutral-600'
                      }`}
                    >
                      {attendance.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">إلغاء الجلسة</h3>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="سبب الإلغاء (اختياري)"
              className="w-full rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              rows={3}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                إلغاء
              </Button>
              <Button
                onClick={handleCancel}
                isLoading={cancelSession.isPending}
                className="bg-error-600 hover:bg-error-700"
              >
                تأكيد الإلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
