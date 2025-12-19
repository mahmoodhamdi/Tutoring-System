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

const reportColors: Record<string, string> = {
  attendance: 'bg-blue-50 text-blue-600 border-blue-200',
  payments: 'bg-green-50 text-green-600 border-green-200',
  performance: 'bg-purple-50 text-purple-600 border-purple-200',
  students: 'bg-primary-50 text-primary-600 border-primary-200',
  sessions: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  financial_summary: 'bg-red-50 text-red-600 border-red-200',
};

export function ReportCard({ report, isSelected, onClick }: ReportCardProps) {
  const Icon = reportIcons[report.id] || ClipboardDocumentListIcon;
  const colorClass = reportColors[report.id] || reportColors.attendance;

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border-2 text-right transition-all ${
        isSelected
          ? `${colorClass} border-current shadow-md`
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isSelected ? colorClass : 'bg-gray-100 text-gray-600'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
            {report.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{report.description}</p>
        </div>
      </div>
    </button>
  );
}
