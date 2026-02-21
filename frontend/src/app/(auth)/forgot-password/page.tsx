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
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <Alert variant="success" className="mb-4">
          تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.
        </Alert>
        <Link
          href="/login"
          className="block text-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          العودة إلى تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
        نسيت كلمة المرور؟
      </h2>
      <p className="text-center text-gray-600 mb-6">
        أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
      </p>

      {error && (
        <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
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
