'use client';

import type { ReportType } from '@/types/report';
import {
  ClipboardDocumentListIcon,
  BanknotesIcon,
  AcademicCapIcon,
  UsersIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface ReportCardProps {
  report: ReportType;
  isSelected: boolean;
  onClick: () => void;
}

const reportIcons: Record<string, typeof ClipboardDocumentListIcon> = {
  attendance: ClipboardDocumentListIcon,
  payments: BanknotesIcon,
  performance: AcademicCapIcon,
  students: UsersIcon,
  sessions: CalendarDaysIcon,
  financial_summary: CurrencyDollarIcon,
};

const reportColors: Record<string, { icon: string; selected: string; badge: string }> = {
  attendance: {
    icon: 'bg-primary-100 text-primary-600',
    selected: 'border-primary-400 bg-primary-50',
    badge: 'bg-primary-600',
  },
  payments: {
    icon: 'bg-success-100 text-success-600',
    selected: 'border-success-400 bg-success-50',
    badge: 'bg-success-600',
  },
  performance: {
    icon: 'bg-secondary-100 text-secondary-600',
    selected: 'border-secondary-400 bg-secondary-50',
    badge: 'bg-secondary-600',
  },
  students: {
    icon: 'bg-primary-100 text-primary-600',
    selected: 'border-primary-400 bg-primary-50',
    badge: 'bg-primary-600',
  },
  sessions: {
    icon: 'bg-accent-100 text-accent-600',
    selected: 'border-accent-400 bg-accent-50',
    badge: 'bg-accent-600',
  },
  financial_summary: {
    icon: 'bg-error-100 text-error-600',
    selected: 'border-error-400 bg-error-50',
    badge: 'bg-error-600',
  },
};

export function ReportCard({ report, isSelected, onClick }: ReportCardProps) {
  const Icon = reportIcons[report.id] || ClipboardDocumentListIcon;
  const colors = reportColors[report.id] || reportColors.attendance;

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border-2 text-right transition-all duration-200 ${
        isSelected
          ? `${colors.selected} border-current shadow-md`
          : 'bg-white border-neutral-100 hover:border-neutral-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${isSelected ? colors.icon : 'bg-neutral-100 text-neutral-500'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 text-right">
          <h3 className={`font-bold text-sm ${isSelected ? 'text-neutral-900' : 'text-neutral-700'}`}>
            {report.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{report.description}</p>
        </div>
      </div>
    </button>
  );
}
