'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePayments, usePaymentReport, useDeletePayment } from '@/hooks/usePayments';
import { PaymentsTable, PaymentStats } from '@/components/payments';
import { Button } from '@/components/ui/Button';
import { PaymentListParams, PaymentStatus } from '@/types/payment';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function PaymentsPage() {
  const [params, setParams] = useState<PaymentListParams>({
    page: 1,
    per_page: 10,
    sort_by: 'payment_date',
    sort_order: 'desc',
  });

  const { data, isLoading, isError, error } = usePayments(params);
  const { data: reportData } = usePaymentReport();
  const deletePayment = useDeletePayment();

  const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);

  const handleStatusFilter = useCallback((status?: PaymentStatus) => {
    setParams((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const handleMonthFilter = useCallback((month?: number) => {
    setParams((prev) => ({ ...prev, period_month: month, page: 1 }));
  }, []);

  const handleYearFilter = useCallback((year?: number) => {
    setParams((prev) => ({ ...prev, period_year: year, page: 1 }));
  }, []);

  const handleDelete = useCallback(
    async (payment: { id: number }) => {
      if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
        try {
          await deletePayment.mutateAsync(payment.id);
        } catch {
          // Error is handled by the mutation
        }
      }
    },
    [deletePayment]
  );

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'يناير' },
    { value: 2, label: 'فبراير' },
    { value: 3, label: 'مارس' },
    { value: 4, label: 'أبريل' },
    { value: 5, label: 'مايو' },
    { value: 6, label: 'يونيو' },
    { value: 7, label: 'يوليو' },
    { value: 8, label: 'أغسطس' },
    { value: 9, label: 'سبتمبر' },
    { value: 10, label: 'أكتوبر' },
    { value: 11, label: 'نوفمبر' },
    { value: 12, label: 'ديسمبر' },
  ];

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">حدث خطأ</h3>
          <p className="mt-2 text-sm text-red-700">
            {(error as Error)?.message || 'فشل في تحميل المدفوعات'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المدفوعات</h1>
          <p className="mt-1 text-sm text-gray-500">
            إدارة مدفوعات الطلاب والرسوم
          </p>
        </div>
        <Link href="/dashboard/payments/new">
          <Button>
            <CurrencyDollarIcon className="w-5 h-5 ml-2" />
            تسجيل دفعة
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {reportData && (
        <div className="mb-6">
          <PaymentStats summary={reportData.summary} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          onChange={(e) =>
            handleStatusFilter(e.target.value as PaymentStatus | undefined || undefined)
          }
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">كل الحالات</option>
          <option value="paid">مدفوع</option>
          <option value="pending">معلق</option>
          <option value="partial">جزئي</option>
          <option value="refunded">مسترد</option>
        </select>

        <select
          onChange={(e) =>
            handleMonthFilter(e.target.value ? parseInt(e.target.value) : undefined)
          }
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">كل الشهور</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            handleYearFilter(e.target.value ? parseInt(e.target.value) : undefined)
          }
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">كل السنوات</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      ) : (
        <PaymentsTable
          payments={data?.data || []}
          onDelete={handleDelete}
          isDeleting={deletePayment.isPending}
        />
      )}

      {/* Pagination */}
      {data && data.meta.last_page > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            عرض <span className="font-medium">{data.meta.from || 0}</span> إلى{' '}
            <span className="font-medium">{data.meta.to || 0}</span> من{' '}
            <span className="font-medium">{data.meta.total}</span> دفعة
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={data.meta.current_page === 1}
              onClick={() => handlePageChange(data.meta.current_page - 1)}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              disabled={data.meta.current_page === data.meta.last_page}
              onClick={() => handlePageChange(data.meta.current_page + 1)}
            >
              التالي
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
