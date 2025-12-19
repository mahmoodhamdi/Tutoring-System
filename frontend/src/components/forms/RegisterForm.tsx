'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';

export function RegisterForm() {
  const { register: registerUser, isLoading, registerError } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      role: 'student',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      await registerUser(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Create your account
      </h2>

      {(error || registerError) && (
        <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
          {error || 'Registration failed. Please try again.'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+201234567890"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Email (Optional)"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          helperText="At least 8 characters with uppercase, lowercase, and numbers"
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            {...register('role')}
          >
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
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
