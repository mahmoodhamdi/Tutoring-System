'use client';

import Link from 'next/link';
import { Payment } from '@/types/payment';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { PencilSquareIcon, TrashIcon, EyeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface PaymentsTableProps {
  payments: Payment[];
  onDelete?: (payment: Payment) => void;
  isDeleting?: boolean;
}

export function PaymentsTable({ payments, onDelete, isDeleting }: PaymentsTableProps) {
  const statusColors: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    partial: 'bg-blue-100 text-blue-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">لا توجد مدفوعات</h3>
        <p className="mt-1 text-sm text-gray-500">ابدأ بتسجيل دفعة جديدة</p>
        <div className="mt-6">
          <Link
            href="/dashboard/payments/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            تسجيل دفعة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pr-4 pl-3 text-right text-sm font-semibold text-gray-900">الطالب</th>
            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">المبلغ</th>
            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">الفترة</th>
            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">تاريخ الدفع</th>
            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">الطريقة</th>
            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">الحالة</th>
            <th className="relative py-3.5 pr-3 pl-4">
              <span className="sr-only">إجراءات</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap py-4 pr-4 pl-3">
                <div className="font-medium text-gray-900">{payment.student?.name}</div>
                <div className="text-sm text-gray-500">{payment.student?.phone}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-900">
                {payment.amount.toLocaleString('ar-EG')} ج.م
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {payment.period}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {format(new Date(payment.payment_date), 'd MMM yyyy', { locale: arSA })}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {payment.payment_method_label}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[payment.status]}`}>
                  {payment.status_label}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pr-3 pl-4 text-left text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/payments/${payment.id}`}
                    className="text-gray-600 hover:text-gray-900"
                    title="عرض"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(payment)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      title="حذف"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentsTable;
