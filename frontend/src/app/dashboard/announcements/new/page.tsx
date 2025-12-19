'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateAnnouncement } from '@/hooks/useAnnouncements';
import { AnnouncementForm } from '@/components/announcements';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const createAnnouncement = useCreateAnnouncement();

  const handleSubmit = async (data: any) => {
    try {
      const announcement = await createAnnouncement.mutateAsync(data);
      router.push(`/dashboard/announcements/${announcement.id}`);
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/announcements"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إعلان جديد</h1>
          <p className="text-gray-600">إنشاء إعلان جديد</p>
        </div>
      </div>

      {/* Form */}
      <AnnouncementForm onSubmit={handleSubmit} isSubmitting={createAnnouncement.isPending} />
    </div>
  );
}
