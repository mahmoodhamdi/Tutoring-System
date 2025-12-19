'use client';

import {
  CurrencyDollarIcon,
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
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      isCurrency: true,
    },
    {
      label: 'المبالغ المعلقة',
      value: summary.pending_amount,
      count: summary.pending_count,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      isCurrency: true,
    },
    {
      label: 'المبالغ الجزئية',
      value: summary.partial_amount,
      count: summary.partial_count,
      icon: ExclamationTriangleIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      isCurrency: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${stat.bgColor} rounded-lg p-3`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.isCurrency ? `${stat.value.toLocaleString('ar-EG')} ج.م` : stat.value}
              </p>
              <p className="text-xs text-gray-400">{stat.count} دفعة</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PaymentStats;
