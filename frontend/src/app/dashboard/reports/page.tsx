'use client';

import { useState } from 'react';
import {
  useReportTypes,
  useAttendanceReport,
  usePaymentsReport,
  usePerformanceReport,
  useStudentsReport,
  useSessionsReport,
  useFinancialSummaryReport,
  useExportCsv,
} from '@/hooks/useReports';
import { ReportCard, ReportFiltersComponent } from '@/components/reports';
import type { ReportFilters } from '@/types/report';
import { formatCurrency } from '@/lib/utils';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// Report data types
interface AttendanceStudentRow {
  student_id: number;
  student_name: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  rate: number;
}

interface AttendanceDataRow {
  id: number;
  student_name: string;
  session_title: string;
  session_date: string;
  status: string;
  status_label: string;
}

interface AttendanceReportData {
  summary: {
    total: number;
    present: number;
    absent: number;
    late: number;
    attendance_rate: number;
  };
  by_student: AttendanceStudentRow[];
  data: AttendanceDataRow[];
}

interface PaymentsStudentRow {
  student_id: number;
  student_name: string;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
}

interface PaymentsDataRow {
  id: number;
  student_name: string;
  amount: number;
  status: string;
  status_label: string;
  due_date: string | null;
}

interface PaymentsReportData {
  summary: {
    paid_amount: number;
    paid_count: number;
    pending_amount: number;
    pending_count: number;
    overdue_amount: number;
    overdue_count: number;
    collection_rate: number;
  };
  by_student: PaymentsStudentRow[];
  data: PaymentsDataRow[];
}

interface PerformanceStudentRow {
  student_id: number;
  student_name: string;
  exam_count: number;
  exam_average: number;
  quiz_count: number;
  quiz_average: number;
  overall_average: number;
}

interface PerformanceReportData {
  exam_summary: {
    total_exams: number;
    total_results: number;
    average_percentage: number;
    pass_count: number;
    fail_count: number;
    pass_rate: number;
  };
  quiz_summary: {
    total_exams: number;
    total_results: number;
    average_percentage: number;
    pass_count: number;
    fail_count: number;
    pass_rate: number;
  };
  by_student: PerformanceStudentRow[];
}

interface StudentsDataRow {
  id: number;
  name: string;
  phone: string;
  groups: string | null;
  status: string;
  status_label: string;
  parent_name: string | null;
}

interface StudentsReportData {
  summary: {
    total: number;
    active: number;
    inactive: number;
    graduated: number;
  };
  data: StudentsDataRow[];
}

interface SessionsDataRow {
  id: number;
  title: string;
  group_name: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  status: string;
  status_label: string;
  attendances_count: number;
}

interface SessionsReportData {
  summary: {
    total: number;
    completed: number;
    scheduled: number;
    cancelled: number;
    total_duration_hours: number;
  };
  data: SessionsDataRow[];
}

interface MonthlyRow {
  month: string;
  label: string;
  revenue: number;
  pending: number;
  overdue: number;
  count: number;
}

interface TopStudentRow {
  student_id: number;
  student_name: string;
  total: number;
}

interface OutstandingStudentRow {
  student_id: number;
  student_name: string;
  outstanding: number;
}

interface FinancialReportData {
  summary: {
    total_revenue: number;
    total_pending: number;
    total_overdue: number;
    total_expected: number;
    collection_rate: number;
  };
  monthly: MonthlyRow[];
  top_students: TopStudentRow[];
  outstanding_students: OutstandingStudentRow[];
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>('attendance');
  const [filters, setFilters] = useState<ReportFilters>({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  const { data: reportTypes, isLoading: typesLoading } = useReportTypes();
  const exportCsv = useExportCsv();

  // Report queries
  const attendanceReport = useAttendanceReport(filters, selectedReport === 'attendance');
  const paymentsReport = usePaymentsReport(filters, selectedReport === 'payments');
  const performanceReport = usePerformanceReport(filters, selectedReport === 'performance');
  const studentsReport = useStudentsReport(filters, selectedReport === 'students');
  const sessionsReport = useSessionsReport(filters, selectedReport === 'sessions');
  const financialReport = useFinancialSummaryReport(filters, selectedReport === 'financial_summary');

  const isLoading =
    (selectedReport === 'attendance' && attendanceReport.isLoading) ||
    (selectedReport === 'payments' && paymentsReport.isLoading) ||
    (selectedReport === 'performance' && performanceReport.isLoading) ||
    (selectedReport === 'students' && studentsReport.isLoading) ||
    (selectedReport === 'sessions' && sessionsReport.isLoading) ||
    (selectedReport === 'financial_summary' && financialReport.isLoading);

  const handleExport = async () => {
    if (['attendance', 'payments', 'students', 'sessions'].includes(selectedReport)) {
      try {
        await exportCsv.mutateAsync({ reportType: selectedReport, filters });
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  };

  const canExport = ['attendance', 'payments', 'students', 'sessions'].includes(selectedReport);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير</h1>
          <p className="text-gray-600">عرض وتصدير التقارير المختلفة</p>
        </div>
        {canExport && (
          <button
            onClick={handleExport}
            disabled={exportCsv.isPending || isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            {exportCsv.isPending ? 'جاري التصدير...' : 'تصدير CSV'}
          </button>
        )}
      </div>

      {/* Report Type Selection */}
      {typesLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes?.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              isSelected={selectedReport === report.id}
              onClick={() => setSelectedReport(report.id)}
            />
          ))}
        </div>
      )}

      {/* Filters */}
      <ReportFiltersComponent
        reportType={selectedReport}
        filters={filters}
        onChange={setFilters}
      />

      {/* Report Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">جاري تحميل التقرير...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Attendance Report */}
          {selectedReport === 'attendance' && attendanceReport.data && (
            <AttendanceReportView data={attendanceReport.data as AttendanceReportData} />
          )}

          {/* Payments Report */}
          {selectedReport === 'payments' && paymentsReport.data && (
            <PaymentsReportView data={paymentsReport.data as PaymentsReportData} />
          )}

          {/* Performance Report */}
          {selectedReport === 'performance' && performanceReport.data && (
            <PerformanceReportView data={performanceReport.data as PerformanceReportData} />
          )}

          {/* Students Report */}
          {selectedReport === 'students' && studentsReport.data && (
            <StudentsReportView data={studentsReport.data as StudentsReportData} />
          )}

          {/* Sessions Report */}
          {selectedReport === 'sessions' && sessionsReport.data && (
            <SessionsReportView data={sessionsReport.data as SessionsReportData} />
          )}

          {/* Financial Summary */}
          {selectedReport === 'financial_summary' && financialReport.data && (
            <FinancialReportView data={financialReport.data as FinancialReportData} />
          )}
        </>
      )}
    </div>
  );
}

// Attendance Report View
function AttendanceReportView({ data }: { data: AttendanceReportData }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الحضور</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{data.summary.total}</p>
            <p className="text-sm text-gray-600">إجمالي</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{data.summary.present}</p>
            <p className="text-sm text-green-700">حاضر</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{data.summary.absent}</p>
            <p className="text-sm text-red-700">غائب</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{data.summary.late}</p>
            <p className="text-sm text-yellow-700">متأخر</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{data.summary.attendance_rate}%</p>
            <p className="text-sm text-blue-700">نسبة الحضور</p>
          </div>
        </div>
      </div>

      {/* By Student */}
      {data.by_student.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">حسب الطالب</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الطالب</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">إجمالي</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">حاضر</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">غائب</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">متأخر</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">النسبة</th>
                </tr>
              </thead>
              <tbody>
                {data.by_student.map((student: AttendanceStudentRow) => (
                  <tr key={student.student_id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{student.student_name}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{student.total}</td>
                    <td className="py-3 px-4 text-center text-green-600">{student.present}</td>
                    <td className="py-3 px-4 text-center text-red-600">{student.absent}</td>
                    <td className="py-3 px-4 text-center text-yellow-600">{student.late}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-medium ${
                          student.rate >= 80
                            ? 'text-green-600'
                            : student.rate >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {student.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          التفاصيل ({data.data.length} سجل)
        </h3>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-600">الطالب</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">الجلسة</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">التاريخ</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {data.data.slice(0, 100).map((item: AttendanceDataRow) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{item.student_name}</td>
                  <td className="py-3 px-4 text-gray-600">{item.session_title}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{item.session_date}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'present'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'absent'
                          ? 'bg-red-100 text-red-700'
                          : item.status === 'late'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.status_label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Payments Report View
function PaymentsReportView({ data }: { data: PaymentsReportData }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص المدفوعات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-xl font-bold text-green-600">{formatCurrency(data.summary.paid_amount)}</p>
            <p className="text-sm text-green-700">مدفوع ({data.summary.paid_count})</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-xl font-bold text-yellow-600">{formatCurrency(data.summary.pending_amount)}</p>
            <p className="text-sm text-yellow-700">معلق ({data.summary.pending_count})</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-xl font-bold text-red-600">{formatCurrency(data.summary.overdue_amount)}</p>
            <p className="text-sm text-red-700">متأخر ({data.summary.overdue_count})</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-xl font-bold text-blue-600">{data.summary.collection_rate}%</p>
            <p className="text-sm text-blue-700">نسبة التحصيل</p>
          </div>
        </div>
      </div>

      {/* By Student */}
      {data.by_student.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">حسب الطالب</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الطالب</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">الإجمالي</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">مدفوع</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">معلق</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">متأخر</th>
                </tr>
              </thead>
              <tbody>
                {data.by_student.map((student: PaymentsStudentRow) => (
                  <tr key={student.student_id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{student.student_name}</td>
                    <td className="py-3 px-4 text-gray-600">{formatCurrency(student.total_amount)}</td>
                    <td className="py-3 px-4 text-green-600">{formatCurrency(student.paid_amount)}</td>
                    <td className="py-3 px-4 text-yellow-600">{formatCurrency(student.pending_amount)}</td>
                    <td className="py-3 px-4 text-red-600">{formatCurrency(student.overdue_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          التفاصيل ({data.data.length} سجل)
        </h3>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-600">الطالب</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">المبلغ</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">الحالة</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">تاريخ الاستحقاق</th>
              </tr>
            </thead>
            <tbody>
              {data.data.slice(0, 100).map((item: PaymentsDataRow) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{item.student_name}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status_label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">{item.due_date || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Performance Report View
function PerformanceReportView({ data }: { data: PerformanceReportData }) {
  return (
    <div className="space-y-6">
      {/* Exam Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الامتحانات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{data.exam_summary.total_exams}</p>
            <p className="text-sm text-blue-700">امتحان</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{data.exam_summary.average_percentage}%</p>
            <p className="text-sm text-purple-700">المتوسط</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{data.exam_summary.pass_count}</p>
            <p className="text-sm text-green-700">ناجح</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{data.exam_summary.fail_count}</p>
            <p className="text-sm text-red-700">راسب</p>
          </div>
        </div>
      </div>

      {/* Quiz Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الاختبارات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{data.quiz_summary.total_exams}</p>
            <p className="text-sm text-blue-700">اختبار</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{data.quiz_summary.average_percentage}%</p>
            <p className="text-sm text-purple-700">المتوسط</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{data.quiz_summary.pass_count}</p>
            <p className="text-sm text-green-700">ناجح</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{data.quiz_summary.fail_count}</p>
            <p className="text-sm text-red-700">راسب</p>
          </div>
        </div>
      </div>

      {/* By Student */}
      {data.by_student.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">أداء الطلاب</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الطالب</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">عدد الامتحانات</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">معدل الامتحانات</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">عدد الاختبارات</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">معدل الاختبارات</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">المعدل العام</th>
                </tr>
              </thead>
              <tbody>
                {data.by_student.map((student: PerformanceStudentRow) => (
                  <tr key={student.student_id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{student.student_name}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{student.exam_count}</td>
                    <td className="py-3 px-4 text-center text-blue-600">{student.exam_average}%</td>
                    <td className="py-3 px-4 text-center text-gray-600">{student.quiz_count}</td>
                    <td className="py-3 px-4 text-center text-purple-600">{student.quiz_average}%</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold ${
                          student.overall_average >= 80
                            ? 'text-green-600'
                            : student.overall_average >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {student.overall_average}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Students Report View
function StudentsReportView({ data }: { data: StudentsReportData }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلاب</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{data.summary.total}</p>
            <p className="text-sm text-gray-600">إجمالي</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{data.summary.active}</p>
            <p className="text-sm text-green-700">نشط</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{data.summary.inactive}</p>
            <p className="text-sm text-yellow-700">غير نشط</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{data.summary.graduated}</p>
            <p className="text-sm text-blue-700">متخرج</p>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          قائمة الطلاب ({data.data.length} طالب)
        </h3>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-600">الاسم</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">الهاتف</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">المجموعات</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">ولي الأمر</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((student: StudentsDataRow) => (
                <tr key={student.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
                  <td className="py-3 px-4 text-gray-600">{student.phone}</td>
                  <td className="py-3 px-4 text-gray-600">{student.groups || '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : student.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {student.status_label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{student.parent_name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sessions Report View
function SessionsReportView({ data }: { data: SessionsReportData }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الجلسات</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{data.summary.total}</p>
            <p className="text-sm text-gray-600">إجمالي</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{data.summary.completed}</p>
            <p className="text-sm text-green-700">مكتملة</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{data.summary.scheduled}</p>
            <p className="text-sm text-blue-700">مجدولة</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{data.summary.cancelled}</p>
            <p className="text-sm text-red-700">ملغاة</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{data.summary.total_duration_hours}</p>
            <p className="text-sm text-purple-700">ساعة</p>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          قائمة الجلسات ({data.data.length} جلسة)
        </h3>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-600">العنوان</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">المجموعة</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">التاريخ</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">الوقت</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">الحالة</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">الحضور</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((session: SessionsDataRow) => (
                <tr key={session.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{session.title}</td>
                  <td className="py-3 px-4 text-gray-600">{session.group_name || '-'}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{session.session_date}</td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {(session.start_time || '--:--').substring(0, 5)} - {(session.end_time || '--:--').substring(0, 5)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : session.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {session.status_label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">{session.attendances_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Financial Report View
function FinancialReportView({ data }: { data: FinancialReportData }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الملخص المالي</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-xl font-bold text-green-600">{formatCurrency(data.summary.total_revenue)}</p>
            <p className="text-sm text-green-700">الإيرادات</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-xl font-bold text-yellow-600">{formatCurrency(data.summary.total_pending)}</p>
            <p className="text-sm text-yellow-700">معلق</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-xl font-bold text-red-600">{formatCurrency(data.summary.total_overdue)}</p>
            <p className="text-sm text-red-700">متأخر</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{formatCurrency(data.summary.total_expected)}</p>
            <p className="text-sm text-gray-600">المتوقع</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-xl font-bold text-blue-600">{data.summary.collection_rate}%</p>
            <p className="text-sm text-blue-700">نسبة التحصيل</p>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {data.monthly.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">التفصيل الشهري</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الشهر</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">الإيرادات</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">معلق</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">متأخر</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">عدد المعاملات</th>
                </tr>
              </thead>
              <tbody>
                {data.monthly.map((month: MonthlyRow) => (
                  <tr key={month.month} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{month.label}</td>
                    <td className="py-3 px-4 text-green-600">{formatCurrency(month.revenue)}</td>
                    <td className="py-3 px-4 text-yellow-600">{formatCurrency(month.pending)}</td>
                    <td className="py-3 px-4 text-red-600">{formatCurrency(month.overdue)}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{month.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Students & Outstanding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.top_students.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">أعلى المسددين</h3>
            <div className="space-y-3">
              {data.top_students.map((student: TopStudentRow, index: number) => (
                <div key={student.student_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : index === 1
                          ? 'bg-gray-300 text-gray-700'
                          : index === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-gray-900">{student.student_name}</span>
                  </div>
                  <span className="font-medium text-green-600">{formatCurrency(student.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.outstanding_students.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">مستحقات متأخرة</h3>
            <div className="space-y-3">
              {data.outstanding_students.map((student: OutstandingStudentRow) => (
                <div key={student.student_id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-gray-900">{student.student_name}</span>
                  <span className="font-medium text-red-600">{formatCurrency(student.outstanding)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
