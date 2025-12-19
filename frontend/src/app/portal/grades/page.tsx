'use client';

import { usePortalGrades } from '@/hooks/usePortal';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function PortalGradesPage() {
  const { data, isLoading, error } = usePortalGrades();

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الدرجات</h1>
        <p className="text-gray-600">نتائج الامتحانات والاختبارات</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.exam_count}</p>
              <p className="text-sm text-gray-500">امتحان</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.quiz_count}</p>
              <p className="text-sm text-gray-500">اختبار</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                data.summary.exam_average >= 60
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.exam_average}%</p>
              <p className="text-sm text-gray-500">معدل الامتحانات</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                data.summary.quiz_average >= 60
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.quiz_average}%</p>
              <p className="text-sm text-gray-500">معدل الاختبارات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exams */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">نتائج الامتحانات</h2>
        {data.exams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الامتحان</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">التاريخ</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">الدرجة</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">النسبة</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {data.exams.map((exam) => (
                  <tr key={exam.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{exam.title}</p>
                      {exam.group_name && (
                        <p className="text-xs text-gray-500">{exam.group_name}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{exam.date}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-gray-900">
                        {exam.obtained_marks}/{exam.total_marks}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold ${
                          exam.percentage >= 80
                            ? 'text-green-600'
                            : exam.percentage >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {exam.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {exam.is_passed ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircleIcon className="w-4 h-4" />
                          ناجح
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600">
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
          <div className="text-center py-8 text-gray-500">
            <AcademicCapIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>لا توجد نتائج امتحانات</p>
          </div>
        )}
      </div>

      {/* Quizzes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">نتائج الاختبارات</h2>
        {data.quizzes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الاختبار</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">التاريخ</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">الدرجة</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">النسبة</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {data.quizzes.map((quiz) => (
                  <tr key={quiz.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{quiz.title}</p>
                      {quiz.group_name && (
                        <p className="text-xs text-gray-500">{quiz.group_name}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{quiz.date}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-gray-900">
                        {quiz.score}/{quiz.total_points}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold ${
                          quiz.percentage >= 80
                            ? 'text-green-600'
                            : quiz.percentage >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {quiz.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {quiz.is_passed ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircleIcon className="w-4 h-4" />
                          ناجح
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600">
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
          <div className="text-center py-8 text-gray-500">
            <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>لا توجد نتائج اختبارات</p>
          </div>
        )}
      </div>
    </div>
  );
}
