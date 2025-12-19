'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePayment, useUpdatePayment } from '@/hooks/usePayments';
import { PaymentForm } from '@/components/payments';
import { Alert } from '@/components/ui/Alert';
import { PaymentFormData } from '@/types/payment';

interface EditPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPaymentPage({ params }: EditPaymentPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const paymentId = parseInt(id, 10);

  const { data: payment, isLoading, isError, error } = usePayment(paymentId);
  const updatePayment = useUpdatePayment();

  const handleSubmit = async (data: PaymentFormData) => {
    try {
      await updatePayment.mutateAsync({ id: paymentId, data });
      router.push(`/dashboard/payments/${paymentId}`);
    } catch {
      // Error is handled by the mutation
    }
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

  if (!payment) {
    return (
      <div className="p-6">
        <Alert variant="error">الدفعة غير موجودة</Alert>
      </div>
    );
  }

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
          <Link href={`/dashboard/payments/${paymentId}`} className="hover:text-gray-700">
            تفاصيل الدفعة
          </Link>
          <span>/</span>
          <span className="text-gray-900">تعديل</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">تعديل الدفعة</h1>
        <p className="mt-1 text-sm text-gray-500">
          تعديل بيانات الدفعة
        </p>
      </div>

      {/* Form */}
      <PaymentForm
        payment={payment}
        onSubmit={handleSubmit}
        isSubmitting={updatePayment.isPending}
      />
    </div>
  );
}
