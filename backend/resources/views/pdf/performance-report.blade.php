@extends('pdf.layout')

@section('title', 'تقرير الأداء الأكاديمي')

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
    </div>
    @endif

    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td style="width: 33%; text-align: center; background: #f0f9ff; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 24px; font-weight: bold; color: #0284c7;">{{ $summary['total_students'] }}</div>
                <div style="font-size: 11px; color: #666;">عدد الطلاب</div>
            </td>
            <td style="width: 33%; text-align: center; background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 24px; font-weight: bold; color: #333;">{{ number_format($summary['average_score'], 1) }}%</div>
                <div style="font-size: 11px; color: #666;">متوسط الدرجات</div>
            </td>
            <td style="width: 33%; text-align: center; background: #f0fdf4; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 24px; font-weight: bold; color: #22c55e;">{{ $summary['pass_rate'] }}%</div>
                <div style="font-size: 11px; color: #666;">نسبة النجاح</div>
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>الطالب</th>
                <th>المجموعة</th>
                <th>عدد الامتحانات</th>
                <th>عدد الاختبارات</th>
                <th>متوسط الامتحانات</th>
                <th>متوسط الاختبارات</th>
                <th>المعدل العام</th>
                <th>الحالة</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $index => $student)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $student->name ?? $student['name'] ?? '-' }}</td>
                <td>{{ $student->group_name ?? $student['group_name'] ?? '-' }}</td>
                <td class="text-center">{{ $student->exam_count ?? $student['exam_count'] ?? 0 }}</td>
                <td class="text-center">{{ $student->quiz_count ?? $student['quiz_count'] ?? 0 }}</td>
                <td class="text-center">
                    @php
                        $examAvg = $student->exam_average ?? $student['exam_average'] ?? 0;
                    @endphp
                    <span class="{{ $examAvg >= 60 ? 'text-success' : 'text-danger' }}">
                        {{ number_format($examAvg, 1) }}%
                    </span>
                </td>
                <td class="text-center">
                    @php
                        $quizAvg = $student->quiz_average ?? $student['quiz_average'] ?? 0;
                    @endphp
                    <span class="{{ $quizAvg >= 60 ? 'text-success' : 'text-danger' }}">
                        {{ number_format($quizAvg, 1) }}%
                    </span>
                </td>
                <td class="text-center font-bold">
                    @php
                        $avg = $student->average_score ?? $student['average_score'] ?? 0;
                    @endphp
                    <span class="{{ $avg >= 80 ? 'text-success' : ($avg >= 60 ? 'text-warning' : 'text-danger') }}">
                        {{ number_format($avg, 1) }}%
                    </span>
                </td>
                <td class="text-center">
                    @php
                        $avgScore = $student->average_score ?? $student['average_score'] ?? 0;
                    @endphp
                    @if($avgScore >= 60)
                        <span class="text-success font-bold">ناجح</span>
                    @else
                        <span class="text-danger font-bold">راسب</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="9" class="text-center">لا توجد بيانات</td>
            </tr>
            @endforelse
        </tbody>
    </table>
@endsection
