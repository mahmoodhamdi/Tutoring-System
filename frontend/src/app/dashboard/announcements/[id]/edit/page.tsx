'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAnnouncement, useUpdateAnnouncement } from '@/hooks/useAnnouncements';
import { AnnouncementForm } from '@/components/announcements';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function EditAnnouncementPage() {
  const params = useParams();
  const router = useRouter();
  const announcementId = parseInt(params.id as string);

  const { data: announcement, isLoading } = useAnnouncement(announcementId);
  const updateAnnouncement = useUpdateAnnouncement();

  const handleSubmit = async (data: any) => {
    try {
      await updateAnnouncement.mutateAsync({ id: announcementId, data });
      router.push(`/dashboard/announcements/${announcementId}`);
    } catch (error) {
      console.error('Failed to update announcement:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">الإعلان غير موجود</p>
        <Link href="/dashboard/announcements" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          العودة للإعلانات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/announcements/${announcementId}`}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل الإعلان</h1>
          <p className="text-gray-600">{announcement.title}</p>
        </div>
      </div>

      {/* Form */}
      <AnnouncementForm
        announcement={announcement}
        onSubmit={handleSubmit}
        isSubmitting={updateAnnouncement.isPending}
      />
    </div>
  );
}
