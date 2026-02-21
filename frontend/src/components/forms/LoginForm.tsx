'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const { login, isLoading, loginError } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      await login(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('فشل تسجيل الدخول. تحقق من بياناتك.');
      }
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        تسجيل الدخول
      </h2>

      {(error || loginError) && (
        <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
          {error || 'بيانات الدخول غير صحيحة. حاول مرة أخرى.'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="رقم الهاتف"
          type="tel"
          placeholder="01xxxxxxxxx"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="كلمة المرور"
          type="password"
          placeholder="أدخل كلمة المرور"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-700">
              تذكرني
            </label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          تسجيل الدخول
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        ليس لديك حساب؟{' '}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          سجل الآن
        </Link>
      </p>
    </div>
  );
}
