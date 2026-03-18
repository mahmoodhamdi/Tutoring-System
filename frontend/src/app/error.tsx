'use client';

import { useEffect } from 'react';
import { ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4" dir="rtl">
      <div className="text-center max-w-md animate-fade-in-up">
        {/* Animated illustration */}
        <div className="relative inline-flex items-center justify-center w-28 h-28 mb-8">
          <div className="absolute inset-0 bg-error-100 rounded-full animate-pulse-soft" />
          <div className="relative w-20 h-20 bg-gradient-to-bl from-error-400 to-error-600 rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(239,68,68,0.3)]">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-neutral-800 mb-3">
          حدث خطأ غير متوقع
        </h1>
        <p className="text-neutral-500 mb-10 leading-relaxed">
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-l from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] transition-all duration-200 active:scale-[0.98]"
          >
            <ArrowPathIcon className="w-5 h-5" />
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-all duration-200"
          >
            <HomeIcon className="w-5 h-5" />
            الصفحة الرئيسية
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-10 bg-neutral-100 rounded-xl p-4 text-left border border-neutral-200" dir="ltr">
            <p className="text-xs font-mono text-error-600 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-neutral-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
