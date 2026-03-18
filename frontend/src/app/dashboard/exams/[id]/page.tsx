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
    scheduled: 'bg-primary-100 text-primary-800',
    in_progress: 'bg-warning-100 text-warning-800',
    completed: 'bg-secondary-100 text-secondary-800',
    cancelled: 'bg-error-100 text-error-800',
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
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <Link href="/dashboard" className="hover:text-neutral-700 transition-colors">
            لوحة التحكم
          </Link>
          <span className="text-neutral-300">/</span>
          <Link href="/dashboard/exams" className="hover:text-neutral-700 transition-colors">
            الاختبارات
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-semibold">{exam.title}</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900">{exam.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColors[exam.status]}`}>
                {exam.status_label}
              </span>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-info-100 text-info-800">
                {exam.exam_type_label}
              </span>
              {!exam.is_published && (
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-warning-100 text-warning-800">
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
                className="text-error-600 border-error-300 hover:bg-error-50 transition-all duration-200"
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
              className="text-error-600 border-error-300 hover:bg-error-50 transition-all duration-200"
            >
              حذف
            </Button>
          </div>
        </div>
      </div>

      {/* Exam Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-neutral-900 mb-4">تفاصيل الاختبار</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-5 w-5 text-neutral-400 ml-2" />
                <div>
                  <p className="text-sm text-neutral-500">التاريخ</p>
                  <p className="font-semibold text-neutral-900">
                    {format(new Date(exam.exam_date), 'd MMMM yyyy', { locale: arSA })}
                  </p>
                </div>
              </div>

              {exam.start_time && (
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-neutral-400 ml-2" />
                  <div>
                    <p className="text-sm text-neutral-500">الوقت</p>
                    <p className="font-semibold text-neutral-900">{exam.start_time}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-neutral-400 ml-2" />
                <div>
                  <p className="text-sm text-neutral-500">المدة</p>
                  <p className="font-semibold text-neutral-900">{exam.duration_minutes} دقيقة</p>
                </div>
              </div>

              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-neutral-400 ml-2" />
                <div>
                  <p className="text-sm text-neutral-500">المجموعة</p>
                  <p className="font-semibold text-neutral-900">{exam.group?.name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 text-neutral-400 ml-2" />
                <div>
                  <p className="text-sm text-neutral-500">الدرجة الكلية</p>
                  <p className="font-semibold text-neutral-900">{exam.total_marks}</p>
                </div>
              </div>

              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-neutral-400 ml-2" />
                <div>
                  <p className="text-sm text-neutral-500">درجة النجاح</p>
                  <p className="font-semibold text-neutral-900">{exam.pass_marks || (exam.total_marks * 0.6)}</p>
                </div>
              </div>
            </div>

            {exam.description && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-sm text-neutral-500">الوصف</p>
                <p className="mt-1 text-neutral-700">{exam.description}</p>
              </div>
            )}

            {exam.instructions && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-sm text-neutral-500">التعليمات</p>
                <p className="mt-1 text-neutral-700 whitespace-pre-wrap">{exam.instructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-neutral-900 mb-4">الإحصائيات</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-neutral-50">
                <span className="text-sm text-neutral-500">النتائج المسجلة</span>
                <span className="font-bold text-neutral-900">{exam.graded_count}/{exam.results_count}</span>
              </div>

              {exam.average_marks !== null && (
                <div className="flex justify-between items-center py-2 border-b border-neutral-50">
                  <span className="text-sm text-neutral-500">متوسط الدرجات</span>
                  <span className="font-bold text-neutral-900">{exam.average_marks?.toFixed(1)}</span>
                </div>
              )}

              {exam.average_percentage !== null && (
                <div className="flex justify-between items-center py-2 border-b border-neutral-50">
                  <span className="text-sm text-neutral-500">متوسط النسبة</span>
                  <span className="font-bold text-neutral-900">{exam.average_percentage?.toFixed(1)}%</span>
                </div>
              )}

              {exam.pass_rate !== null && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-neutral-500">نسبة النجاح</span>
                  <span className="font-bold text-secondary-600">{exam.pass_rate}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h2 className="text-lg font-extrabold text-neutral-900 mb-4">النتائج</h2>

        {resultsLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded-xl" />
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
          <p className="text-neutral-500 text-center py-8">لم يتم تسجيل نتائج بعد</p>
        )}
      </div>
    </div>
  );
}
