'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateSession } from '@/hooks/useSessions';
import { SessionForm } from '@/components/sessions';
import { SessionFormData } from '@/types/session';

export default function NewSessionPage() {
  const router = useRouter();
  const createSession = useCreateSession();

  const handleSubmit = async (data: SessionFormData) => {
    try {
      await createSession.mutateAsync(data);
      router.push('/dashboard/schedule');
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
          <Link href="/dashboard/schedule" className="hover:text-gray-700">
            الجدول
          </Link>
          <span>/</span>
          <span className="text-gray-900">إضافة جلسة جديدة</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">إضافة جلسة جديدة</h1>
        <p className="mt-1 text-sm text-gray-500">
          أدخل بيانات الجلسة الجديدة
        </p>
      </div>

      {/* Form */}
      <SessionForm onSubmit={handleSubmit} isSubmitting={createSession.isPending} />
    </div>
  );
}
