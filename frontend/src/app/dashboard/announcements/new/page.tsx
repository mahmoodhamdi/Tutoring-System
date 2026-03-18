'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateAnnouncement } from '@/hooks/useAnnouncements';
import { AnnouncementForm } from '@/components/announcements';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { CreateAnnouncementData } from '@/types/announcement';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const createAnnouncement = useCreateAnnouncement();

  const handleSubmit = async (data: CreateAnnouncementData) => {
    try {
      const announcement = await createAnnouncement.mutateAsync(data);
      router.push(`/dashboard/announcements/${announcement.id}`);
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/announcements"
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">إعلان جديد</h1>
          <p className="text-neutral-600">إنشاء إعلان جديد</p>
        </div>
      </div>

      {/* Form */}
      <AnnouncementForm onSubmit={handleSubmit} isSubmitting={createAnnouncement.isPending} />
    </div>
  );
}
