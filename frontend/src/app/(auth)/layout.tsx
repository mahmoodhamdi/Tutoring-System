'use client';

import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Right side - decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-bl from-primary-600 via-primary-700 to-primary-900">
        {/* Decorative shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-12 text-center">
          {/* Logo icon */}
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 animate-float">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>

          <h2 className="text-4xl font-extrabold text-white mb-4">
            نظام الدروس الخصوصية
          </h2>
          <p className="text-primary-200 text-lg max-w-md leading-relaxed">
            منصة متكاملة لإدارة الدروس الخصوصية والطلاب والمجموعات والمدفوعات والاختبارات
          </p>

          {/* Feature cards */}
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
            {[
              { icon: '👨‍🎓', text: 'إدارة الطلاب' },
              { icon: '📊', text: 'تقارير مفصلة' },
              { icon: '💳', text: 'تتبع المدفوعات' },
              { icon: '📝', text: 'اختبارات وكويزات' },
            ].map((feature) => (
              <div key={feature.text} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-right">
                <span className="text-2xl">{feature.icon}</span>
                <p className="text-white/90 text-sm font-medium mt-2">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left side - form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-10">
            {/* Mobile logo */}
            <div className="lg:hidden mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-bl from-primary-500 to-primary-700 flex items-center justify-center shadow-primary">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
            </div>
            <Link href="/" className="text-3xl font-extrabold gradient-text">
              نظام الدروس الخصوصية
            </Link>
            <p className="mt-3 text-neutral-500">
              منصة إدارة الدروس الخصوصية المتكاملة
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
