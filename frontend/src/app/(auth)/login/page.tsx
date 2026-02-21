import { LoginForm } from '@/components/forms/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول - نظام الدروس الخصوصية',
  description: 'سجّل الدخول إلى حسابك في نظام الدروس الخصوصية',
};

export default function LoginPage() {
  return <LoginForm />;
}
