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
    <div className="bg-white py-10 px-8 shadow-xl shadow-neutral-200/50 rounded-2xl border border-neutral-100">
      <h2 className="text-2xl font-extrabold text-center text-neutral-800 mb-2">
        مرحباً بعودتك! 👋
      </h2>
      <p className="text-center text-neutral-500 mb-8 text-sm">
        سجّل الدخول للوصول إلى لوحة التحكم
      </p>

      {(error || loginError) && (
        <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
          {error || 'بيانات الدخول غير صحيحة. حاول مرة أخرى.'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="رقم الهاتف"
          type="tel"
          placeholder="01xxxxxxxxx"
          error={errors.phone?.message}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          }
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
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-md border-2 border-neutral-300 bg-white transition-all duration-200 peer-checked:bg-primary-600 peer-checked:border-primary-600 peer-focus:ring-2 peer-focus:ring-primary-200 flex items-center justify-center">
                <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <span className="text-sm text-neutral-600 group-hover:text-neutral-800 transition-colors">تذكرني</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          تسجيل الدخول
        </Button>
      </form>

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-neutral-400">أو</span>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-neutral-500">
        ليس لديك حساب؟{' '}
        <Link
          href="/register"
          className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
        >
          سجل الآن
        </Link>
      </p>
    </div>
  );
}
