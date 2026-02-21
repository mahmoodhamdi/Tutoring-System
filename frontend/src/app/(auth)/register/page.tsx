import { RegisterForm } from '@/components/forms/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إنشاء حساب - نظام الدروس الخصوصية',
  description: 'أنشئ حسابك الجديد في نظام الدروس الخصوصية',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
