import { RegisterForm } from '@/components/forms/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Tutoring System',
  description: 'Create your Tutoring System account',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
