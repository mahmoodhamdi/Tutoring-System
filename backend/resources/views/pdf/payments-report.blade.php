@extends('pdf.layout')

@section('title', 'تقرير المدفوعات')

@section('content')
    @if(!empty($filters))
    <div class="filters">
        <strong>الفلاتر:</strong>
        @if(!empty($filters['start_date']))
            <span>من: {{ $filters['start_date'] }}</span>
        @endif
        @if(!empty($filters['end_date']))
            <span>إلى: {{ $filters['end_date'] }}</span>
        @endif
        @if(!empty($filters['status']))
            <span>الحالة: {{ $filters['status'] }}</span>
        @endif
    </div>
    @endif

    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td style="width: 20%; text-align: center; background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 24px; font-weight: bold; color: #333;">{{ $summary['total_count'] }}</div>
                <div style="font-size: 11px; color: #666;">عدد المدفوعات</div>
            </td>
            <td style="width: 20%; text-align: center; background: #f0f9ff; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 18px; font-weight: bold; color: #0284c7;">{{ number_format($summary['total_amount'], 2) }} ج.م</div>
                <div style="font-size: 11px; color: #666;">الإجمالي</div>
            </td>
            <td style="width: 20%; text-align: center; background: #f0fdf4; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 18px; font-weight: bold; color: #22c55e;">{{ number_format($summary['paid_amount'], 2) }} ج.م</div>
                <div style="font-size: 11px; color: #666;">المدفوع</div>
            </td>
            <td style="width: 20%; text-align: center; background: #fffbeb; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 18px; font-weight: bold; color: #f59e0b;">{{ number_format($summary['pending_amount'], 2) }} ج.م</div>
                <div style="font-size: 11px; color: #666;">معلق</div>
            </td>
            <td style="width: 20%; text-align: center; background: #fef2f2; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 18px; font-weight: bold; color: #ef4444;">{{ number_format($summary['overdue_amount'], 2) }} ج.م</div>
                <div style="font-size: 11px; color: #666;">متأخر</div>
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>الطالب</th>
                <th>الوصف</th>
                <th>المبلغ</th>
                <th>تاريخ الاستحقاق</th>
                <th>تاريخ الدفع</th>
                <th>الحالة</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $index => $payment)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $payment->student->name ?? '-' }}</td>
                <td>{{ $payment->description ?? '-' }}</td>
                <td class="text-center font-bold">{{ number_format($payment->amount, 2) }} ج.م</td>
                <td class="text-center">{{ $payment->due_date ?? '-' }}</td>
                <td class="text-center">{{ $payment->paid_at ?? '-' }}</td>
                <td class="text-center">
                    @switch($payment->status)
                        @case('paid')
                            <span class="status-paid">مدفوع</span>
                            @break
                        @case('pending')
                            <span class="status-pending">معلق</span>
                            @break
                        @case('overdue')
                            <span class="status-overdue">متأخر</span>
                            @break
                        @case('partial')
                            <span class="status-partial">جزئي</span>
                            @break
                        @default
                            {{ $payment->status }}
                    @endswitch
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="text-center">لا توجد مدفوعات</td>
            </tr>
            @endforelse
        </tbody>
    </table>
@endsection
