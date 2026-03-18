import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4" dir="rtl">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="relative inline-flex items-center justify-center w-28 h-28 mb-8">
          <div className="absolute inset-0 bg-primary-100 rounded-full animate-pulse-soft" />
          <div className="relative w-20 h-20 bg-gradient-to-bl from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(99,102,241,0.3)]">
            <span className="text-3xl font-extrabold text-white">404</span>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-neutral-800 mb-3">
          الصفحة غير موجودة
        </h1>
        <p className="text-neutral-500 mb-10 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-l from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] transition-all duration-200 active:scale-[0.98]"
        >
          <HomeIcon className="w-5 h-5" />
          الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
