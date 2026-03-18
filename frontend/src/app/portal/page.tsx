'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalLogin } from '@/hooks/usePortal';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function PortalLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = usePortalLogin();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('portal_token');
    if (token) {
      router.push('/portal/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login.mutateAsync({ identifier, password });
      router.push('/portal/dashboard');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent-400/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-bl from-secondary-500 to-secondary-700 rounded-2xl mb-5 shadow-[0_8px_24px_rgba(20,184,166,0.3)] animate-float">
            <AcademicCapIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900">بوابة الطلاب وأولياء الأمور</h1>
          <p className="text-neutral-500 mt-2 text-sm">تسجيل الدخول للوصول إلى حسابك</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-neutral-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-error-50 border border-error-100 rounded-xl text-error-600 text-sm flex items-start gap-2.5 animate-slide-down">
                <span className="mt-0.5 w-4 h-4 flex-shrink-0">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold text-neutral-700 mb-2">
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:ring-0 focus:border-primary-500 transition-colors bg-neutral-50 focus:bg-white"
                placeholder="أدخل البريد الإلكتروني أو رقم الهاتف"
                dir="ltr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:ring-0 focus:border-primary-500 transition-colors bg-neutral-50 focus:bg-white"
                placeholder="أدخل كلمة المرور"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-3 px-4 bg-gradient-to-l from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)]"
            >
              {login.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-100 text-center text-sm text-neutral-400">
            <p>إذا لم تتمكن من تسجيل الدخول، يرجى التواصل مع الإدارة</p>
          </div>
        </div>
      </div>
    </div>
  );
}
