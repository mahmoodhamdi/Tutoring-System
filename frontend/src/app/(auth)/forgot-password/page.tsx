'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', data);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('فشل إرسال رابط إعادة التعيين. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 py-8 px-6 animate-scale-in">
        <Alert variant="success" className="mb-5">
          تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.
        </Alert>
        <Link
          href="/login"
          className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          العودة إلى تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 py-8 px-6 animate-fade-in-up">
      <h2 className="text-2xl font-extrabold text-center text-neutral-900 mb-2">
        نسيت كلمة المرور؟
      </h2>
      <p className="text-center text-neutral-500 text-sm mb-6">
        أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
      </p>

      {error && (
        <Alert variant="error" className="mb-5" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="البريد الإلكتروني"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          إرسال رابط إعادة التعيين
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
