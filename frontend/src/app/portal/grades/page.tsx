'use client';

import { usePortalGrades } from '@/hooks/usePortal';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function PortalGradesPage() {
  const { data, isLoading, error } = usePortalGrades();

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

  const getPercentageColor = (pct: number) =>
    pct >= 80
      ? 'text-success-600'
      : pct >= 60
      ? 'text-warning-600'
      : 'text-error-600';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">الدرجات</h1>
        <p className="text-neutral-500 text-sm mt-1">نتائج الامتحانات والاختبارات</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {/* Exam Count */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-info-50 text-info-600">
              <AcademicCapIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-neutral-900">{data.summary.exam_count}</p>
              <p className="text-xs text-neutral-500 mt-0.5">امتحان</p>
            </div>
          </div>
        </div>

        {/* Quiz Count */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
              <DocumentTextIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-neutral-900">{data.summary.quiz_count}</p>
              <p className="text-xs text-neutral-500 mt-0.5">اختبار</p>
            </div>
          </div>
        </div>

        {/* Exam Average */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                data.summary.exam_average >= 60
                  ? 'bg-success-50 text-success-600'
                  : 'bg-error-50 text-error-600'
              }`}
            >
              <AcademicCapIcon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-2xl font-extrabold ${getPercentageColor(data.summary.exam_average)}`}>
                {data.summary.exam_average}%
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">معدل الامتحانات</p>
            </div>
          </div>
        </div>

        {/* Quiz Average */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 card-hover">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                data.summary.quiz_average >= 60
                  ? 'bg-success-50 text-success-600'
                  : 'bg-error-50 text-error-600'
              }`}
            >
              <DocumentTextIcon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-2xl font-extrabold ${getPercentageColor(data.summary.quiz_average)}`}>
                {data.summary.quiz_average}%
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">معدل الاختبارات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-info-50 text-info-600">
            <AcademicCapIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-neutral-900">نتائج الامتحانات</h2>
        </div>
        {data.exams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-neutral-100">
                  <th className="text-right py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    الامتحان
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    الدرجة
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    النسبة
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {data.exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-neutral-900">{exam.title}</p>
                      {exam.group_name && (
                        <p className="text-xs text-neutral-400 mt-0.5">{exam.group_name}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center text-neutral-500 text-sm">{exam.date}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-neutral-900">
                        {exam.obtained_marks}/{exam.total_marks}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-extrabold text-base ${getPercentageColor(exam.percentage)}`}>
                        {exam.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {exam.is_passed ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-semibold">
                          <CheckCircleIcon className="w-4 h-4" />
                          ناجح
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-error-50 text-error-700 rounded-full text-xs font-semibold">
                          <XCircleIcon className="w-4 h-4" />
                          راسب
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-neutral-400">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-50 rounded-2xl mb-3">
              <AcademicCapIcon className="w-7 h-7 text-neutral-300" />
            </div>
            <p className="text-sm">لا توجد نتائج امتحانات</p>
          </div>
        )}
      </div>

      {/* Quizzes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
            <DocumentTextIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-neutral-900">نتائج الاختبارات</h2>
        </div>
        {data.quizzes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-neutral-100">
                  <th className="text-right py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    الاختبار
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    الدرجة
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    النسبة
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-500 text-xs uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {data.quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-neutral-900">{quiz.title}</p>
                      {quiz.group_name && (
                        <p className="text-xs text-neutral-400 mt-0.5">{quiz.group_name}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center text-neutral-500 text-sm">{quiz.date}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-neutral-900">
                        {quiz.score}/{quiz.total_points}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-extrabold text-base ${getPercentageColor(quiz.percentage)}`}>
                        {quiz.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {quiz.is_passed ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-semibold">
                          <CheckCircleIcon className="w-4 h-4" />
                          ناجح
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-error-50 text-error-700 rounded-full text-xs font-semibold">
                          <XCircleIcon className="w-4 h-4" />
                          راسب
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-neutral-400">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-50 rounded-2xl mb-3">
              <DocumentTextIcon className="w-7 h-7 text-neutral-300" />
            </div>
            <p className="text-sm">لا توجد نتائج اختبارات</p>
          </div>
        )}
      </div>
    </div>
  );
}
