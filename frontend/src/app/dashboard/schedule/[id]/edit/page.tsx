'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, useUpdateSession } from '@/hooks/useSessions';
import { SessionForm } from '@/components/sessions';
import { Alert } from '@/components/ui/Alert';
import { SessionFormData } from '@/types/session';

interface EditSessionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditSessionPage({ params }: EditSessionPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const sessionId = parseInt(id, 10);

  const { data: session, isLoading, isError, error } = useSession(sessionId);
  const updateSession = useUpdateSession();

  const handleSubmit = async (data: SessionFormData) => {
    try {
      await updateSession.mutateAsync({ id: sessionId, data });
      router.push(`/dashboard/schedule/${sessionId}`);
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
          {(error as Error)?.message || 'فشل في تحميل بيانات الجلسة'}
        </Alert>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6">
        <Alert variant="error">الجلسة غير موجودة</Alert>
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
          <Link href="/dashboard/schedule" className="hover:text-gray-700">
            الجدول
          </Link>
          <span>/</span>
          <Link href={`/dashboard/schedule/${sessionId}`} className="hover:text-gray-700">
            {session.title}
          </Link>
          <span>/</span>
          <span className="text-gray-900">تعديل</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">تعديل الجلسة</h1>
        <p className="mt-1 text-sm text-gray-500">
          تعديل بيانات الجلسة
        </p>
      </div>

      {/* Form */}
      <SessionForm
        session={session}
        onSubmit={handleSubmit}
        isSubmitting={updateSession.isPending}
      />
    </div>
  );
}
