'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePayment, useDeletePayment } from '@/hooks/usePayments';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import {
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface PaymentPageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const paymentId = parseInt(id, 10);

  const { data: payment, isLoading, isError, error } = usePayment(paymentId);
  const deletePayment = useDeletePayment();

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      try {
        await deletePayment.mutateAsync(paymentId);
        router.push('/dashboard/payments');
      } catch {
        // Error is handled by the mutation
      }
    }
  };

  const statusColors: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    partial: 'bg-blue-100 text-blue-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  const paymentMethodLabels: Record<string, string> = {
    cash: 'نقداً',
    bank_transfer: 'تحويل بنكي',
    online: 'دفع إلكتروني',
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
          {(error as Error)?.message || 'فشل في تحميل بيانات الدفعة'}
        </Alert>
      </div>
    );
  }

  if (!payment?.data) {
    return (
      <div className="p-6">
        <Alert variant="error">الدفعة غير موجودة</Alert>
      </div>
    );
  }

  const paymentData = payment.data;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-gray-700">
            لوحة التحكم
          </Link>
          <span>/</span>
          <Link href="/dashboard/payments" className="hover:text-gray-700">
            المدفوعات
          </Link>
          <span>/</span>
          <span className="text-gray-900">تفاصيل الدفعة</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تفاصيل الدفعة</h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-2 ${
                statusColors[paymentData.status]
              }`}
            >
              {paymentData.status_label}
            </span>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/payments/${paymentData.id}/edit`}>
              <Button variant="outline">تعديل</Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleDelete}
              isLoading={deletePayment.isPending}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              حذف
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          {/* Amount */}
          <div className="text-center pb-6 border-b border-gray-200">
            <CurrencyDollarIcon className="h-12 w-12 mx-auto text-primary-600 mb-2" />
            <p className="text-4xl font-bold text-gray-900">
              {paymentData.amount.toLocaleString('ar-EG')} ج.م
            </p>
            <p className="text-sm text-gray-500 mt-1">{paymentData.period}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex items-start">
              <UserIcon className="h-5 w-5 text-gray-400 ml-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">الطالب</p>
                <p className="font-medium text-gray-900">{paymentData.student?.name}</p>
                <p className="text-sm text-gray-500">{paymentData.student?.phone}</p>
              </div>
            </div>

            {paymentData.group && (
              <div className="flex items-start">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 ml-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">المجموعة</p>
                  <p className="font-medium text-gray-900">{paymentData.group.name}</p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 text-gray-400 ml-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">تاريخ الدفع</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(paymentData.payment_date), 'd MMMM yyyy', {
                    locale: arSA,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CreditCardIcon className="h-5 w-5 text-gray-400 ml-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">طريقة الدفع</p>
                <p className="font-medium text-gray-900">
                  {paymentData.payment_method_label || paymentMethodLabels[paymentData.payment_method]}
                </p>
              </div>
            </div>

            {paymentData.receipt_number && (
              <div className="flex items-start">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 ml-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">رقم الإيصال</p>
                  <p className="font-medium text-gray-900">{paymentData.receipt_number}</p>
                </div>
              </div>
            )}

            {paymentData.received_by_user && (
              <div className="flex items-start">
                <UserIcon className="h-5 w-5 text-gray-400 ml-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">استلمها</p>
                  <p className="font-medium text-gray-900">
                    {paymentData.received_by_user.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {paymentData.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">ملاحظات</p>
              <p className="mt-1 text-gray-900">{paymentData.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              تم الإنشاء:{' '}
              {format(new Date(paymentData.created_at), 'd MMMM yyyy h:mm a', {
                locale: arSA,
              })}
            </span>
            {paymentData.updated_at !== paymentData.created_at && (
              <span>
                آخر تحديث:{' '}
                {format(new Date(paymentData.updated_at), 'd MMMM yyyy h:mm a', {
                  locale: arSA,
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-4">
        <Link
          href={`/dashboard/students/${paymentData.student_id}`}
          className="flex-1 flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <UserIcon className="h-5 w-5 text-gray-400 ml-2" />
          <span className="font-medium text-gray-900">عرض ملف الطالب</span>
        </Link>
        <Link
          href={`/dashboard/payments?student_id=${paymentData.student_id}`}
          className="flex-1 flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <CurrencyDollarIcon className="h-5 w-5 text-gray-400 ml-2" />
          <span className="font-medium text-gray-900">كل مدفوعات الطالب</span>
        </Link>
      </div>
    </div>
  );
}
