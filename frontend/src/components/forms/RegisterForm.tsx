'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';

export function RegisterForm() {
  const { register: registerUser, isLoading, registerError } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      role: 'student',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      await registerUser(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  return (
    <div className="bg-white py-10 px-8 shadow-xl shadow-neutral-200/50 rounded-2xl border border-neutral-100">
      <h2 className="text-2xl font-extrabold text-center text-neutral-800 mb-2">
        إنشاء حساب جديد
      </h2>
      <p className="text-center text-neutral-500 mb-8 text-sm">
        سجّل حسابك للبدء في استخدام المنصة
      </p>

      {(error || registerError) && (
        <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
          {error || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="الاسم الكامل"
          type="text"
          placeholder="أدخل اسمك الكامل"
          error={errors.name?.message}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
          {...register('name')}
        />

        <Input
          label="رقم الهاتف"
          type="tel"
          placeholder="+201234567890"
          error={errors.phone?.message}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          }
          {...register('phone')}
        />

        <Input
          label="البريد الإلكتروني (اختياري)"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          }
          {...register('email')}
        />

        <Input
          label="كلمة المرور"
          type="password"
          placeholder="أنشئ كلمة مرور قوية"
          error={errors.password?.message}
          helperText="8 أحرف على الأقل تتضمن أحرفاً كبيرة وصغيرة وأرقاماً"
          {...register('password')}
        />

        <Input
          label="تأكيد كلمة المرور"
          type="password"
          placeholder="أعد إدخال كلمة المرور"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            نوع الحساب
          </label>
          <select
            className="block w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5 text-sm bg-white transition-all duration-200 focus:border-primary-500 focus:outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
            {...register('role')}
          >
            <option value="student">طالب</option>
            <option value="parent">ولي أمر</option>
          </select>
          {errors.role && (
            <p className="mt-1.5 text-sm text-error-600 flex items-center gap-1">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {errors.role.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          إنشاء حساب
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
        لديك حساب بالفعل؟{' '}
        <Link
          href="/login"
          className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
        >
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
