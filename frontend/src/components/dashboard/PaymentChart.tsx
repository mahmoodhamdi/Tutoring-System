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
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-extrabold text-neutral-900">المدفوعات</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-neutral-400">نسبة التحصيل:</span>
          <span
            className={`font-extrabold text-base px-2.5 py-0.5 rounded-lg ${
              data.collection_rate >= 80
                ? 'text-secondary-600 bg-secondary-50'
                : data.collection_rate >= 60
                ? 'text-accent-600 bg-accent-50'
                : 'text-error-600 bg-error-50'
            }`}
          >
            {data.collection_rate}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex h-3.5 rounded-full overflow-hidden bg-neutral-100">
          <div
            className="bg-secondary-500 transition-all duration-500"
            style={{ width: `${paidPercentage}%` }}
            title={`مدفوع: ${formatCurrency(data.total_paid)}`}
          ></div>
          <div
            className="bg-accent-500 transition-all duration-500"
            style={{ width: `${pendingPercentage}%` }}
            title={`معلق: ${formatCurrency(data.total_pending)}`}
          ></div>
          <div
            className="bg-error-500 transition-all duration-500"
            style={{ width: `${overduePercentage}%` }}
            title={`متأخر: ${formatCurrency(data.total_overdue)}`}
          ></div>
        </div>
        <div className="flex justify-between mt-2.5 text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-secondary-500 rounded-full"></span>
            <span>مدفوع ({data.paid_count})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-accent-500 rounded-full"></span>
            <span>معلق ({data.pending_count})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-error-500 rounded-full"></span>
            <span>متأخر ({data.overdue_count})</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6 stagger-children">
        <div className="text-center p-4 bg-secondary-50 rounded-xl border border-secondary-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-xl font-extrabold text-secondary-600">{formatCurrency(data.total_paid)}</p>
          <p className="text-xs font-semibold text-secondary-700 mt-0.5">مدفوع</p>
        </div>
        <div className="text-center p-4 bg-accent-50 rounded-xl border border-accent-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-xl font-extrabold text-accent-600">{formatCurrency(data.total_pending)}</p>
          <p className="text-xs font-semibold text-accent-700 mt-0.5">معلق</p>
        </div>
        <div className="text-center p-4 bg-error-50 rounded-xl border border-error-100/60 transition-all duration-200 hover:shadow-sm">
          <p className="text-xl font-extrabold text-error-600">{formatCurrency(data.total_overdue)}</p>
          <p className="text-xs font-semibold text-error-700 mt-0.5">متأخر</p>
        </div>
      </div>

      {/* Trend Chart */}
      {data.trend.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-neutral-600 mb-3">تطور المدفوعات</h4>
          <div className="space-y-2">
            {data.trend.map((item, index) => {
              const monthTotal = item.paid + item.pending + item.overdue;
              const maxMonthTotal = Math.max(...data.trend.map((t) => t.paid + t.pending + t.overdue));
              const width = maxMonthTotal > 0 ? (monthTotal / maxMonthTotal) * 100 : 0;

              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500 w-16 shrink-0">{item.label}</span>
                  <div className="flex-1 h-5 bg-neutral-100 rounded-lg overflow-hidden flex">
                    <div
                      className="bg-secondary-500 transition-all duration-300"
                      style={{ width: monthTotal > 0 ? `${(item.paid / monthTotal) * width}%` : '0%' }}
                    ></div>
                    <div
                      className="bg-accent-400 transition-all duration-300"
                      style={{ width: monthTotal > 0 ? `${(item.pending / monthTotal) * width}%` : '0%' }}
                    ></div>
                    <div
                      className="bg-error-400 transition-all duration-300"
                      style={{ width: monthTotal > 0 ? `${(item.overdue / monthTotal) * width}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-xs text-neutral-600 w-20 text-right shrink-0">
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
        <div className="pt-5 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-neutral-600">طلاب بمدفوعات متأخرة</h4>
            <Link
              href="/dashboard/payments?status=overdue"
              className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-150"
            >
              عرض الكل
            </Link>
          </div>
          <div className="space-y-2">
            {data.overdue_students.slice(0, 5).map((student) => (
              <Link
                key={student.id}
                href={`/dashboard/students/${student.id}`}
                className="flex items-center justify-between p-2.5 bg-error-50 rounded-xl border border-error-100/60 hover:bg-error-100/60 transition-colors duration-150 group"
              >
                <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  {student.name}
                </span>
                <span className="text-sm font-semibold text-error-600 bg-error-100 px-2 py-0.5 rounded-lg">
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
