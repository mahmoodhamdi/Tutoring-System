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
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 py-8 px-6 animate-scale-in">
        <Alert variant="error" className="mb-5">
          رمز إعادة التعيين غير صالح أو مفقود. يرجى طلب رابط إعادة تعيين جديد.
        </Alert>
        <Link
          href="/forgot-password"
          className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          طلب رابط إعادة تعيين جديد
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 py-8 px-6 animate-scale-in">
        <Alert variant="success" className="mb-5">
          تم إعادة تعيين كلمة المرور بنجاح. جاري تحويلك إلى صفحة تسجيل الدخول...
        </Alert>
        <Link
          href="/login"
          className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          الذهاب إلى تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 py-8 px-6 animate-fade-in-up">
      <h2 className="text-2xl font-extrabold text-center text-neutral-900 mb-2">
        إعادة تعيين كلمة المرور
      </h2>
      <p className="text-center text-neutral-500 text-sm mb-6">
        أدخل كلمة المرور الجديدة أدناه.
      </p>

      {error && (
        <Alert variant="error" className="mb-5" onClose={() => setError(null)}>
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

      <p className="mt-6 text-center text-sm text-neutral-500">
        تذكرت كلمة المرور؟{' '}
        <Link
          href="/login"
          className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 py-8 px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-100 rounded-xl w-3/4 mx-auto" />
            <div className="h-4 bg-neutral-100 rounded-xl w-1/2 mx-auto" />
            <div className="space-y-3 mt-6">
              <div className="h-11 bg-neutral-100 rounded-xl" />
              <div className="h-11 bg-neutral-100 rounded-xl" />
              <div className="h-11 bg-neutral-100 rounded-xl" />
              <div className="h-11 bg-neutral-100 rounded-xl" />
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
