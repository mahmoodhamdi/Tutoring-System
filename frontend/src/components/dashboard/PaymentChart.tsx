'use client';

import Link from 'next/link';
import { PaymentStats } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';

interface PaymentChartProps {
  data: PaymentStats;
}

export function PaymentChart({ data }: PaymentChartProps) {
  const total = data.total_paid + data.total_pending + data.total_overdue;
  const paidPercentage = total > 0 ? (data.total_paid / total) * 100 : 0;
  const pendingPercentage = total > 0 ? (data.total_pending / total) * 100 : 0;
  const overduePercentage = total > 0 ? (data.total_overdue / total) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">المدفوعات</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">نسبة التحصيل:</span>
          <span
            className={`font-bold ${
              data.collection_rate >= 80
                ? 'text-green-600'
                : data.collection_rate >= 60
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {data.collection_rate}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
          <div
            className="bg-green-500 transition-all"
            style={{ width: `${paidPercentage}%` }}
            title={`مدفوع: ${formatCurrency(data.total_paid)}`}
          ></div>
          <div
            className="bg-yellow-500 transition-all"
            style={{ width: `${pendingPercentage}%` }}
            title={`معلق: ${formatCurrency(data.total_pending)}`}
          ></div>
          <div
            className="bg-red-500 transition-all"
            style={{ width: `${overduePercentage}%` }}
            title={`متأخر: ${formatCurrency(data.total_overdue)}`}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>مدفوع ({data.paid_count})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span>معلق ({data.pending_count})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>متأخر ({data.overdue_count})</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-xl font-bold text-green-600">{formatCurrency(data.total_paid)}</p>
          <p className="text-xs text-green-700">مدفوع</p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-xl font-bold text-yellow-600">{formatCurrency(data.total_pending)}</p>
          <p className="text-xs text-yellow-700">معلق</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-xl font-bold text-red-600">{formatCurrency(data.total_overdue)}</p>
          <p className="text-xs text-red-700">متأخر</p>
        </div>
      </div>

      {/* Trend Chart */}
      {data.trend.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">تطور المدفوعات</h4>
          <div className="space-y-2">
            {data.trend.map((item, index) => {
              const monthTotal = item.paid + item.pending + item.overdue;
              const maxMonthTotal = Math.max(...data.trend.map((t) => t.paid + t.pending + t.overdue));
              const width = maxMonthTotal > 0 ? (monthTotal / maxMonthTotal) * 100 : 0;

              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16">{item.label}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden flex">
                    <div
                      className="bg-green-500"
                      style={{ width: monthTotal > 0 ? `${(item.paid / monthTotal) * width}%` : '0%' }}
                    ></div>
                    <div
                      className="bg-yellow-500"
                      style={{ width: monthTotal > 0 ? `${(item.pending / monthTotal) * width}%` : '0%' }}
                    ></div>
                    <div
                      className="bg-red-500"
                      style={{ width: monthTotal > 0 ? `${(item.overdue / monthTotal) * width}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 w-20 text-left">
                    {formatCurrency(monthTotal)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overdue Students */}
      {data.overdue_students.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">طلاب بمدفوعات متأخرة</h4>
            <Link
              href="/dashboard/payments?status=overdue"
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              عرض الكل
            </Link>
          </div>
          <div className="space-y-2">
            {data.overdue_students.slice(0, 5).map((student) => (
              <Link
                key={student.id}
                href={`/dashboard/students/${student.id}`}
                className="flex items-center justify-between p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <span className="text-sm text-gray-700">{student.name}</span>
                <span className="text-sm font-medium text-red-600">
                  {formatCurrency(student.overdue_amount)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
