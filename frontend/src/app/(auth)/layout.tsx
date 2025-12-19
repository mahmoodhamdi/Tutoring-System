'use client';

import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            Tutoring System
          </Link>
          <p className="mt-2 text-gray-600">
            Private Tutoring Management System
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
