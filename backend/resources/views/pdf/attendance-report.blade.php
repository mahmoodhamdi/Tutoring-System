@extends('pdf.layout')

@section('title', 'تقرير الحضور')

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
        @if(!empty($filters['group_id']))
            <span>المجموعة: {{ $filters['group_name'] ?? $filters['group_id'] }}</span>
        @endif
        @if(!empty($filters['student_id']))
            <span>الطالب: {{ $filters['student_name'] ?? $filters['student_id'] }}</span>
        @endif
    </div>
    @endif

    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td style="width: 20%; text-align: center; background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 24px; font-weight: bold; color: #333;">{{ $summary['total'] }}</div>
                <div style="font-size: 11px; color: #666;">إجمالي السجلات</div>
            </td>
            <td style="width: 20%; text-align: center; background: #f0fdf4; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 24px; font-weight: bold; color: #22c55e;">{{ $summary['present'] }}</div>
                <div style="font-size: 11px; color: #666;">حاضر</div>
            </td>
            <td style="width: 20%; text-align: center; background: #fef2f2; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 24px; font-weight: bold; color: #ef4444;">{{ $summary['absent'] }}</div>
                <div style="font-size: 11px; color: #666;">غائب</div>
            </td>
            <td style="width: 20%; text-align: center; background: #fffbeb; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">{{ $summary['late'] }}</div>
                <div style="font-size: 11px; color: #666;">متأخر</div>
            </td>
            <td style="width: 20%; text-align: center; background: #eff6ff; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">{{ $summary['excused'] }}</div>
                <div style="font-size: 11px; color: #666;">معذور</div>
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>الطالب</th>
                <th>المجموعة</th>
                <th>الجلسة</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th>ملاحظات</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $index => $record)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $record->student->name ?? '-' }}</td>
                <td>{{ $record->session->group->name ?? '-' }}</td>
                <td>{{ $record->session->title ?? '-' }}</td>
                <td class="text-center">{{ $record->session->session_date ?? '-' }}</td>
                <td class="text-center">
                    @switch($record->status)
                        @case('present')
                            <span class="status-present">حاضر</span>
                            @break
                        @case('absent')
                            <span class="status-absent">غائب</span>
                            @break
                        @case('late')
                            <span class="status-late">متأخر</span>
                            @break
                        @case('excused')
                            <span class="status-excused">معذور</span>
                            @break
                        @default
                            {{ $record->status }}
                    @endswitch
                </td>
                <td>{{ $record->notes ?? '-' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="text-center">لا توجد سجلات</td>
            </tr>
            @endforelse
        </tbody>
    </table>
@endsection
