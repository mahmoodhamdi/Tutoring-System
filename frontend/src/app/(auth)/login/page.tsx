import { LoginForm } from '@/components/forms/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Tutoring System',
  description: 'Sign in to your Tutoring System account',
};

export default function LoginPage() {
  return <LoginForm />;
}
