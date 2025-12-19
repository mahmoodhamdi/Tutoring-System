'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateQuiz } from '@/hooks/useQuizzes';
import { QuizForm } from '@/components/quizzes';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function NewQuizPage() {
  const router = useRouter();
  const createQuiz = useCreateQuiz();

  const handleSubmit = async (data: any) => {
    try {
      const quiz = await createQuiz.mutateAsync(data);
      router.push(`/dashboard/quizzes/${quiz.id}`);
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/quizzes"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">اختبار جديد</h1>
          <p className="text-gray-600">إنشاء اختبار قصير جديد</p>
        </div>
      </div>

      {/* Form */}
      <QuizForm onSubmit={handleSubmit} isSubmitting={createQuiz.isPending} />
    </div>
  );
}
