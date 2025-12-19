'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useExam,
  useDeleteExam,
  usePublishExam,
  useCancelExam,
  useExamResults,
  useRecordExamResults,
} from '@/hooks/useExams';
import { ExamResultsTable } from '@/components/exams';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import {
  AcademicCapIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface ExamPageProps {
  params: Promise<{ id: string }>;
}

export default function ExamPage({ params }: ExamPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const examId = parseInt(id, 10);

  const { data: exam, isLoading, isError, error } = useExam(examId);
  const { data: results, isLoading: resultsLoading } = useExamResults(examId);

  const deleteExam = useDeleteExam();
  const publishExam = usePublishExam();
  const cancelExam = useCancelExam();
  const recordResults = useRecordExamResults();

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      try {
        await deleteExam.mutateAsync(examId);
        router.push('/dashboard/exams');
      } catch {
        // Error handled by mutation
      }
    }
  };

  const handlePublish = async () => {
    try {
      await publishExam.mutateAsync(examId);
    } catch {
      // Error handled by mutation
    }
  };

  const handleCancel = async () => {
    if (confirm('هل أنت متأكد من إلغاء هذا الاختبار؟')) {
      try {
        await cancelExam.mutateAsync(examId);
      } catch {
        // Error handled by mutation
      }
    }
  };

  const handleSaveResults = async (
    data: { student_id: number; marks_obtained?: number; status: string; feedback?: string }[]
  ) => {
    try {
      await recordResults.mutateAsync({
        examId,
        results: data.map((d) => ({
          ...d,
          status: d.status as 'pending' | 'submitted' | 'graded' | 'absent',
        })),
      });
    } catch {
      // Error handled by mutation
    }
  };

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
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
          {(error as Error)?.message || 'فشل في تحميل بيانات الاختبار'}
        </Alert>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-6">
        <Alert variant="error">الاختبار غير موجود</Alert>
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
          <Link href="/dashboard/exams" className="hover:text-gray-700">
            الاختبارات
          </Link>
          <span>/</span>
          <span className="text-gray-900">{exam.title}</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[exam.status]}`}>
                {exam.status_label}
              </span>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
                {exam.exam_type_label}
              </span>
              {!exam.is_published && (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                  غير منشور
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!exam.is_published && exam.status === 'scheduled' && (
              <Button onClick={handlePublish} isLoading={publishExam.isPending}>
                <EyeIcon className="w-4 h-4 ml-2" />
                نشر
              </Button>
            )}
            {exam.status === 'scheduled' && (
              <Button
                variant="outline"
                onClick={handleCancel}
                isLoading={cancelExam.isPending}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <XCircleIcon className="w-4 h-4 ml-2" />
                إلغاء
              </Button>
            )}
            {exam.can_be_edited && (
              <Link href={`/dashboard/exams/${exam.id}/edit`}>
                <Button variant="outline">تعديل</Button>
              </Link>
            )}
            <Button
              variant="outline"
              onClick={handleDelete}
              isLoading={deleteExam.isPending}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              حذف
            </Button>
          </div>
        </div>
      </div>

      {/* Exam Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الاختبار</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">التاريخ</p>
                  <p className="font-medium">
                    {format(new Date(exam.exam_date), 'd MMMM yyyy', { locale: arSA })}
                  </p>
                </div>
              </div>

              {exam.start_time && (
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 ml-2" />
                  <div>
                    <p className="text-sm text-gray-500">الوقت</p>
                    <p className="font-medium">{exam.start_time}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">المدة</p>
                  <p className="font-medium">{exam.duration_minutes} دقيقة</p>
                </div>
              </div>

              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-gray-400 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">المجموعة</p>
                  <p className="font-medium">{exam.group?.name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 text-gray-400 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">الدرجة الكلية</p>
                  <p className="font-medium">{exam.total_marks}</p>
                </div>
              </div>

              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-gray-400 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">درجة النجاح</p>
                  <p className="font-medium">{exam.pass_marks || (exam.total_marks * 0.6)}</p>
                </div>
              </div>
            </div>

            {exam.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">الوصف</p>
                <p className="mt-1">{exam.description}</p>
              </div>
            )}

            {exam.instructions && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">التعليمات</p>
                <p className="mt-1 whitespace-pre-wrap">{exam.instructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">النتائج المسجلة</span>
                <span className="font-semibold">{exam.graded_count}/{exam.results_count}</span>
              </div>

              {exam.average_marks !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">متوسط الدرجات</span>
                  <span className="font-semibold">{exam.average_marks?.toFixed(1)}</span>
                </div>
              )}

              {exam.average_percentage !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">متوسط النسبة</span>
                  <span className="font-semibold">{exam.average_percentage?.toFixed(1)}%</span>
                </div>
              )}

              {exam.pass_rate !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">نسبة النجاح</span>
                  <span className="font-semibold text-green-600">{exam.pass_rate}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">النتائج</h2>

        {resultsLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <ExamResultsTable
            exam={exam}
            results={results}
            onSave={handleSaveResults}
            isSaving={recordResults.isPending}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">لم يتم تسجيل نتائج بعد</p>
        )}
      </div>
    </div>
  );
}
