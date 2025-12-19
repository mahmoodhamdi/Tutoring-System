'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations';
import api from '@/lib/axios';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      email,
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/reset-password', data);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <Alert variant="error" className="mb-4">
          Invalid or missing reset token. Please request a new password reset link.
        </Alert>
        <Link
          href="/forgot-password"
          className="block text-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <Alert variant="success" className="mb-4">
          Your password has been reset successfully. Redirecting to login...
        </Alert>
        <Link
          href="/login"
          className="block text-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
        Reset your password
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your new password below.
      </p>

      {error && (
        <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('token')} />

        <Input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          helperText="At least 8 characters with uppercase, lowercase, and numbers"
          {...register('password')}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm your new password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Reset Password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
