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
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <Link href="/dashboard" className="hover:text-neutral-700 transition-colors">
            لوحة التحكم
          </Link>
          <span className="text-neutral-300">/</span>
          <Link href="/dashboard/schedule" className="hover:text-neutral-700 transition-colors">
            الجدول
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-semibold">إضافة جلسة جديدة</span>
        </nav>
        <h1 className="text-2xl font-extrabold text-neutral-900">إضافة جلسة جديدة</h1>
        <p className="mt-1 text-sm text-neutral-500">
          أدخل بيانات الجلسة الجديدة
        </p>
      </div>

      {/* Form */}
      <SessionForm onSubmit={handleSubmit} isSubmitting={createSession.isPending} />
    </div>
  );
}
