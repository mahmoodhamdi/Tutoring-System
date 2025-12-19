'use client';

import { useRouter } from 'next/navigation';
import { useCreateGroup } from '@/hooks/useGroups';
import { GroupForm } from '@/components/groups';
import { GroupFormData } from '@/types/group';

export default function NewGroupPage() {
  const router = useRouter();
  const createGroup = useCreateGroup();

  const handleSubmit = async (data: GroupFormData) => {
    try {
      await createGroup.mutateAsync(data);
      router.push('/dashboard/groups');
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">إنشاء مجموعة جديدة</h1>
        <p className="mt-2 text-sm text-gray-700">
          أنشئ مجموعة دراسية جديدة وحدد تفاصيلها
        </p>
      </div>

      <GroupForm onSubmit={handleSubmit} isSubmitting={createGroup.isPending} />
    </div>
  );
}
