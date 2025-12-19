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

  const handleRecordAttendance = async (records: { student_id: number; status: string; notes?: string }[]) => {
    try {
      await recordAttendance.mutateAsync({
        sessionId,
        data: { records },
      });
    } catch {
      // Error is handled by the mutation
    }
  };

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
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
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
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

  if (!session) {
    return (
      <div className="p-6">
        <Alert variant="error">الجلسة غير موجودة</Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-gray-700">
            لوحة التحكم
          </Link>
          <span>/</span>
          <Link href="/dashboard/schedule" className="hover:text-gray-700">
            الجدول
          </Link>
          <span>/</span>
          <span className="text-gray-900">{session.title}</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-2 ${
                statusColors[session.status]
              }`}
            >
              {statusLabels[session.status]}
            </span>
          </div>
          <div className="flex gap-2">
            {session.status === 'scheduled' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(true)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
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
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              حذف
            </Button>
          </div>
        </div>
      </div>

      {/* Session Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الجلسة</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">التاريخ</p>
                  <p className="font-medium">
                    {format(new Date(session.scheduled_at), 'd MMMM yyyy', {
                      locale: arSA,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">الوقت</p>
                  <p className="font-medium">
                    {format(new Date(session.scheduled_at), 'h:mm a', {
                      locale: arSA,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">المدة</p>
                  <p className="font-medium">{session.duration_minutes} دقيقة</p>
                </div>
              </div>

              {session.location && (
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gray-400 ml-2" />
                  <div>
                    <p className="text-sm text-gray-500">المكان</p>
                    <p className="font-medium">{session.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-gray-400 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">المجموعة</p>
                  <p className="font-medium">{session.group?.name}</p>
                </div>
              </div>
            </div>

            {session.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">الوصف</p>
                <p className="mt-1">{session.description}</p>
              </div>
            )}

            {session.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">ملاحظات</p>
                <p className="mt-1">{session.notes}</p>
              </div>
            )}

            {session.status === 'cancelled' && session.cancellation_reason && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-red-500">سبب الإلغاء</p>
                <p className="mt-1 text-red-700">{session.cancellation_reason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Section */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">الحضور</h2>

            {attendanceLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded" />
                ))}
              </div>
            ) : session.status === 'scheduled' ? (
              attendanceData?.students ? (
                <AttendanceForm
                  students={attendanceData.students}
                  existingRecords={attendanceData.records}
                  onSubmit={handleRecordAttendance}
                  isSubmitting={recordAttendance.isPending}
                />
              ) : (
                <p className="text-gray-500 text-sm">لا يوجد طلاب في هذه المجموعة</p>
              )
            ) : (
              <div className="space-y-2">
                {attendanceData?.records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{record.student?.name}</span>
                    <span
                      className={`text-sm ${
                        record.status === 'present'
                          ? 'text-green-600'
                          : record.status === 'absent'
                          ? 'text-red-600'
                          : record.status === 'late'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {record.status_label}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إلغاء الجلسة</h3>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="سبب الإلغاء (اختياري)"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              rows={3}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                إلغاء
              </Button>
              <Button
                onClick={handleCancel}
                isLoading={cancelSession.isPending}
                className="bg-red-600 hover:bg-red-700"
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
