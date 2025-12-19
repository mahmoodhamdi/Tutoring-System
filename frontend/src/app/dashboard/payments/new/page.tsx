'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreatePayment } from '@/hooks/usePayments';
import { PaymentForm } from '@/components/payments';
import { PaymentFormData } from '@/types/payment';

export default function NewPaymentPage() {
  const router = useRouter();
  const createPayment = useCreatePayment();

  const handleSubmit = async (data: PaymentFormData) => {
    try {
      await createPayment.mutateAsync(data);
      router.push('/dashboard/payments');
    } catch {
      // Error is handled by the mutation
    }
  };

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
          <span className="text-gray-900">تسجيل دفعة جديدة</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">تسجيل دفعة جديدة</h1>
        <p className="mt-1 text-sm text-gray-500">
          أدخل بيانات الدفعة الجديدة
        </p>
      </div>

      {/* Form */}
      <PaymentForm onSubmit={handleSubmit} isSubmitting={createPayment.isPending} />
    </div>
  );
}
