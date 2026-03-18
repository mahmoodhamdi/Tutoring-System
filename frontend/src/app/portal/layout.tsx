'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { usePortalLogout, usePortalChildren } from '@/hooks/usePortal';
import type { PortalUser } from '@/types/portal';

const studentNavItems = [
  { href: '/portal/dashboard', label: 'الرئيسية', icon: HomeIcon },
  { href: '/portal/attendance', label: 'الحضور', icon: ClipboardDocumentListIcon },
  { href: '/portal/payments', label: 'المدفوعات', icon: BanknotesIcon },
  { href: '/portal/grades', label: 'الدرجات', icon: AcademicCapIcon },
  { href: '/portal/schedule', label: 'الجدول', icon: CalendarDaysIcon },
  { href: '/portal/announcements', label: 'الإعلانات', icon: MegaphoneIcon },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = usePortalLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<number | undefined>();

  const { data: portalChildren } = usePortalChildren();

  const user = useMemo<PortalUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('portal_token');
    const storedUser = localStorage.getItem('portal_user');

    if (!token || !storedUser) {
      if (pathname !== '/portal') {
        router.push('/portal');
      }
      return null;
    }

    try {
      return JSON.parse(storedUser) as PortalUser;
    } catch {
      router.push('/portal');
      return null;
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch {
      // Even if API fails, clear local storage
    }
    localStorage.removeItem('portal_token');
    localStorage.removeItem('portal_user');
    router.push('/portal');
  };

  if (pathname === '/portal') {
    return children;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
          <p className="text-neutral-500 text-sm">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const isParent = user.role === 'parent';

  return (
    <div className="min-h-screen bg-neutral-50" dir="rtl">
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-bl from-secondary-500 to-secondary-700 flex items-center justify-center shadow-[0_4px_12px_rgba(20,184,166,0.3)]">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-neutral-800">بوابة الطلاب</span>
                <p className="text-[11px] text-neutral-400 -mt-0.5">منصة التعلم</p>
              </div>
            </div>

            {/* Child Selector (for parents) */}
            {isParent && portalChildren && portalChildren.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-neutral-400" />
                <select
                  value={selectedChild || ''}
                  onChange={(e) => setSelectedChild(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="px-3 py-1.5 border-2 border-neutral-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0 transition-colors bg-white"
                >
                  {portalChildren.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-bl from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-neutral-700">{user.name}</span>
              </div>
              <div className="h-8 w-px bg-neutral-200 hidden md:block" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-error-600 hover:bg-error-50 rounded-xl transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-semibold">خروج</span>
              </button>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 sticky top-24">
              <ul className="space-y-1">
                {studentNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 shadow-sm'
                            : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive ? 'text-primary-600' : 'text-neutral-400'
                          }`}
                        />
                        <span className="font-semibold text-sm">{item.label}</span>
                        {isActive && (
                          <span className="mr-auto w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="fixed right-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-4 animate-slide-in-right">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-bl from-secondary-500 to-secondary-700 flex items-center justify-center">
                      <AcademicCapIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-base text-neutral-800">القائمة</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Child Selector for mobile */}
                {isParent && portalChildren && portalChildren.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-neutral-100">
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                      اختر الطالب
                    </label>
                    <select
                      value={selectedChild || ''}
                      onChange={(e) =>
                        setSelectedChild(e.target.value ? parseInt(e.target.value) : undefined)
                      }
                      className="w-full px-3 py-2.5 border-2 border-neutral-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0 bg-white"
                    >
                      {portalChildren.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <ul className="space-y-1">
                  {studentNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-50 text-primary-700 shadow-sm'
                              : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 flex-shrink-0 ${
                              isActive ? 'text-primary-600' : 'text-neutral-400'
                            }`}
                          />
                          <span className="font-semibold text-sm">{item.label}</span>
                          {isActive && (
                            <span className="mr-auto w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Mobile user info footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-100 bg-neutral-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-bl from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{user.name}</p>
                      <p className="text-xs text-neutral-400">{isParent ? 'ولي أمر' : 'طالب'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-error-600 hover:bg-error-50 rounded-xl transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0 animate-fade-in">{children}</main>
        </div>
      </div>
    </div>
  );
}
