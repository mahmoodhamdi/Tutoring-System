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
    paid: 'bg-secondary-100 text-secondary-800',
    pending: 'bg-warning-100 text-warning-800',
    partial: 'bg-primary-100 text-primary-800',
    refunded: 'bg-neutral-100 text-neutral-700',
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
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <Link href="/dashboard" className="hover:text-neutral-700 transition-colors">
            لوحة التحكم
          </Link>
          <span className="text-neutral-300">/</span>
          <Link href="/dashboard/payments" className="hover:text-neutral-700 transition-colors">
            المدفوعات
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-semibold">تفاصيل الدفعة</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900">تفاصيل الدفعة</h1>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mt-2 ${
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
              className="text-error-600 border-error-300 hover:bg-error-50"
            >
              حذف
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Amount */}
          <div className="text-center pb-6 border-b border-neutral-100">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
              <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <p className="text-4xl font-extrabold text-neutral-900">
              {paymentData.amount.toLocaleString('ar-EG')} ج.م
            </p>
            <p className="text-sm text-neutral-500 mt-1">{paymentData.period}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex items-start">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center ml-3 flex-shrink-0">
                <UserIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">الطالب</p>
                <p className="font-semibold text-neutral-900">{paymentData.student?.name}</p>
                <p className="text-sm text-neutral-500">{paymentData.student?.phone}</p>
              </div>
            </div>

            {paymentData.group && (
              <div className="flex items-start">
                <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center ml-3 flex-shrink-0">
                  <DocumentTextIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">المجموعة</p>
                  <p className="font-semibold text-neutral-900">{paymentData.group.name}</p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center ml-3 flex-shrink-0">
                <CalendarIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">تاريخ الدفع</p>
                <p className="font-semibold text-neutral-900">
                  {format(new Date(paymentData.payment_date), 'd MMMM yyyy', {
                    locale: arSA,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center ml-3 flex-shrink-0">
                <CreditCardIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">طريقة الدفع</p>
                <p className="font-semibold text-neutral-900">
                  {paymentData.payment_method_label || paymentMethodLabels[paymentData.payment_method]}
                </p>
              </div>
            </div>

            {paymentData.receipt_number && (
              <div className="flex items-start">
                <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center ml-3 flex-shrink-0">
                  <DocumentTextIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">رقم الإيصال</p>
                  <p className="font-semibold text-neutral-900">{paymentData.receipt_number}</p>
                </div>
              </div>
            )}

            {paymentData.received_by_user && (
              <div className="flex items-start">
                <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center ml-3 flex-shrink-0">
                  <UserIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">استلمها</p>
                  <p className="font-semibold text-neutral-900">
                    {paymentData.received_by_user.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {paymentData.notes && (
            <div className="mt-6 pt-6 border-t border-neutral-100">
              <p className="text-sm text-neutral-500">ملاحظات</p>
              <p className="mt-1 text-neutral-700">{paymentData.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-neutral-500">
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
          className="flex-1 flex items-center justify-center p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <UserIcon className="h-5 w-5 text-neutral-400 ml-2" />
          <span className="font-semibold text-neutral-900">عرض ملف الطالب</span>
        </Link>
        <Link
          href={`/dashboard/payments?student_id=${paymentData.student_id}`}
          className="flex-1 flex items-center justify-center p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <CurrencyDollarIcon className="h-5 w-5 text-neutral-400 ml-2" />
          <span className="font-semibold text-neutral-900">كل مدفوعات الطالب</span>
        </Link>
      </div>
    </div>
  );
}
