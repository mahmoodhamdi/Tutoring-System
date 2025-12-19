'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGroup, useUpdateGroup } from '@/hooks/useGroups';
import { GroupForm } from '@/components/groups';
import { GroupFormData } from '@/types/group';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function EditGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = Number(params.id);

  const { data: groupData, isLoading, error } = useGroup(groupId);
  const updateGroup = useUpdateGroup();

  const group = groupData?.data;

  const handleSubmit = async (data: GroupFormData) => {
    try {
      await updateGroup.mutateAsync({ id: groupId, data });
      router.push(`/dashboard/groups/${groupId}`);
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">حدث خطأ أثناء تحميل بيانات المجموعة</p>
        <Link href="/dashboard/groups" className="mt-4 text-primary-600 hover:underline">
          العودة للمجموعات
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href={`/dashboard/groups/${groupId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowRightIcon className="h-4 w-4 ml-1" />
          العودة للمجموعة
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">تعديل المجموعة</h1>
        <p className="mt-2 text-sm text-gray-700">تعديل بيانات المجموعة &quot;{group.name}&quot;</p>
      </div>

      <GroupForm group={group} onSubmit={handleSubmit} isSubmitting={updateGroup.isPending} />
    </div>
  );
}
