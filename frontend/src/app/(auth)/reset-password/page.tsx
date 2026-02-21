'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations';
import api from '@/lib/axios';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      email,
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/reset-password', data);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <Alert variant="error" className="mb-4">
          رمز إعادة التعيين غير صالح أو مفقود. يرجى طلب رابط إعادة تعيين جديد.
        </Alert>
        <Link
          href="/forgot-password"
          className="block text-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          طلب رابط إعادة تعيين جديد
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <Alert variant="success" className="mb-4">
          تم إعادة تعيين كلمة المرور بنجاح. جاري تحويلك إلى صفحة تسجيل الدخول...
        </Alert>
        <Link
          href="/login"
          className="block text-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          الذهاب إلى تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
        إعادة تعيين كلمة المرور
      </h2>
      <p className="text-center text-gray-600 mb-6">
        أدخل كلمة المرور الجديدة أدناه.
      </p>

      {error && (
        <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('token')} />

        <Input
          label="البريد الإلكتروني"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="كلمة المرور الجديدة"
          type="password"
          placeholder="أنشئ كلمة مرور قوية"
          error={errors.password?.message}
          helperText="8 أحرف على الأقل تتضمن أحرفاً كبيرة وصغيرة وأرقاماً"
          {...register('password')}
        />

        <Input
          label="تأكيد كلمة المرور الجديدة"
          type="password"
          placeholder="أعد إدخال كلمة المرور الجديدة"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          إعادة تعيين كلمة المرور
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        تذكرت كلمة المرور؟{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6" />
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
