'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-600 via-primary-700 to-primary-900">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-primary-300/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center animate-fade-in-up">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-8 animate-float">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              نظام الدروس الخصوصية
            </h1>
            <p className="text-lg sm:text-xl text-primary-200 max-w-2xl mx-auto mb-12 leading-relaxed">
              منصة متكاملة لإدارة الدروس الخصوصية والطلاب والمجموعات والمدفوعات والاختبارات
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-2xl font-bold text-lg shadow-xl shadow-primary-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white/20 rounded-2xl font-bold text-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-neutral-800 mb-4">كل ما تحتاجه في مكان واحد</h2>
          <p className="text-neutral-500 max-w-xl mx-auto">أدوات متكاملة لإدارة الدروس الخصوصية بكفاءة واحترافية</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {[
            {
              icon: '👨‍🎓',
              title: 'إدارة الطلاب',
              desc: 'تتبع بيانات الطلاب وتقدمهم الأكاديمي وتواصل مع أولياء الأمور',
              color: 'from-primary-500 to-primary-600',
            },
            {
              icon: '👥',
              title: 'إدارة المجموعات',
              desc: 'نظّم طلابك في مجموعات وحدد مواعيد وأسعار كل مجموعة',
              color: 'from-secondary-500 to-secondary-600',
            },
            {
              icon: '📅',
              title: 'جدولة الحصص',
              desc: 'جدول مرن لإدارة مواعيد الحصص وتتبع الحضور والغياب',
              color: 'from-info-500 to-info-600',
            },
            {
              icon: '💳',
              title: 'تتبع المدفوعات',
              desc: 'سجل المدفوعات وتتبع المستحقات وأصدر إيصالات بسهولة',
              color: 'from-success-500 to-success-600',
            },
            {
              icon: '📝',
              title: 'اختبارات وكويزات',
              desc: 'أنشئ اختبارات متنوعة وقيّم أداء الطلاب بطرق مبتكرة',
              color: 'from-accent-400 to-accent-500',
            },
            {
              icon: '📊',
              title: 'تقارير مفصلة',
              desc: 'احصل على تقارير شاملة عن الأداء والمدفوعات والحضور',
              color: 'from-purple-500 to-purple-600',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl border border-neutral-100 p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-bl ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mb-2">{feature.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-l from-primary-600 to-primary-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">ابدأ الآن مجاناً</h2>
          <p className="text-primary-200 mb-10 text-lg">سجّل حسابك وابدأ في إدارة دروسك الخصوصية باحترافية</p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-primary-700 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
          >
            إنشاء حساب مجاني
            <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-bl from-primary-500 to-primary-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">نظام الدروس الخصوصية</span>
          </div>
          <p className="text-neutral-500 text-sm">جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
