@extends('pdf.layout')

@section('title', 'تقرير الطلاب')

@section('content')
    <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: #f0f9ff; border-radius: 5px;">
        <span style="font-size: 24px; font-weight: bold; color: #0284c7;">{{ $total }}</span>
        <span style="font-size: 14px; color: #666; margin-right: 10px;">إجمالي الطلاب</span>
    </div>

    @if(!empty($filters))
    <div class="filters">
        <strong>الفلاتر:</strong>
        @if(!empty($filters['group_id']))
            <span>المجموعة: {{ $filters['group_name'] ?? $filters['group_id'] }}</span>
        @endif
        @if(!empty($filters['status']))
            <span>الحالة: {{ $filters['status'] == 'active' ? 'نشط' : 'غير نشط' }}</span>
        @endif
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>المجموعات</th>
                <th>نسبة الحضور</th>
                <th>المستحقات</th>
                <th>الحالة</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $index => $student)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $student->name }}</td>
                <td class="text-left">{{ $student->email ?? '-' }}</td>
                <td class="text-left">{{ $student->phone ?? '-' }}</td>
                <td>{{ $student->groups_count ?? 0 }}</td>
                <td class="text-center">
                    @php
                        $rate = $student->attendance_rate ?? 0;
                    @endphp
                    <span class="{{ $rate >= 80 ? 'text-success' : ($rate >= 60 ? 'text-warning' : 'text-danger') }}">
                        {{ $rate }}%
                    </span>
                </td>
                <td class="text-center">
                    @php
                        $pending = $student->pending_amount ?? 0;
                    @endphp
                    <span class="{{ $pending > 0 ? 'text-danger' : 'text-success' }}">
                        {{ number_format($pending, 2) }} ج.م
                    </span>
                </td>
                <td class="text-center">
                    @if($student->is_active ?? true)
                        <span class="text-success">نشط</span>
                    @else
                        <span class="text-danger">غير نشط</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" class="text-center">لا توجد بيانات</td>
            </tr>
            @endforelse
        </tbody>
    </table>
@endsection
