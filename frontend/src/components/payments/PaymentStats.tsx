'use client';

import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface PaymentStatsProps {
  summary: {
    total_collected: number;
    pending_amount: number;
    partial_amount: number;
    paid_count: number;
    pending_count: number;
    partial_count: number;
  };
}

export function PaymentStats({ summary }: PaymentStatsProps) {
  const stats = [
    {
      label: 'إجمالي المحصل',
      value: summary.total_collected,
      count: summary.paid_count,
      icon: CheckCircleIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      borderColor: 'border-success-200',
      isCurrency: true,
    },
    {
      label: 'المبالغ المعلقة',
      value: summary.pending_amount,
      count: summary.pending_count,
      icon: ClockIcon,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
      borderColor: 'border-accent-200',
      isCurrency: true,
    },
    {
      label: 'المبالغ الجزئية',
      value: summary.partial_amount,
      count: summary.partial_count,
      icon: ExclamationTriangleIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      borderColor: 'border-primary-200',
      isCurrency: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white rounded-2xl border ${stat.borderColor} shadow-sm p-6 hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-center">
            <div className={`${stat.bgColor} rounded-xl p-3`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
              <p className={`text-2xl font-extrabold ${stat.color} mt-0.5`}>
                {stat.isCurrency ? `${stat.value.toLocaleString('ar-EG')} ج.م` : stat.value}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">{stat.count} دفعة</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PaymentStats;
