'use client';

import { useEffect, useState } from 'react';
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
import { usePortalLogout, usePortalProfile, usePortalChildren } from '@/hooks/usePortal';
import type { PortalUser, PortalChild } from '@/types/portal';

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
  const [user, setUser] = useState<PortalUser | null>(null);
  const [selectedChild, setSelectedChild] = useState<number | undefined>();

  const { data: profile } = usePortalProfile();
  const { data: portalChildren } = usePortalChildren();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('portal_token');
    const storedUser = localStorage.getItem('portal_user');

    if (!token || !storedUser) {
      if (pathname !== '/portal') {
        router.push('/portal');
      }
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      router.push('/portal');
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (error) {
      // Even if API fails, clear local storage
    }
    localStorage.removeItem('portal_token');
    localStorage.removeItem('portal_user');
    router.push('/portal');
  };

  // If on login page, just render children
  if (pathname === '/portal') {
    return children;
  }

  // If not authenticated, show nothing (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const isParent = user.role === 'parent';

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">بوابة الطلاب</span>
            </div>

            {/* Child Selector (for parents) */}
            {isParent && portalChildren && portalChildren.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedChild || ''}
                  onChange={(e) => setSelectedChild(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
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
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="hidden md:inline">خروج</span>
              </button>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
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
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <ul className="space-y-1">
                {studentNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
              <div className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-lg">القائمة</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                {/* Child Selector for mobile */}
                {isParent && portalChildren && portalChildren.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اختر الطالب
                    </label>
                    <select
                      value={selectedChild || ''}
                      onChange={(e) => setSelectedChild(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
