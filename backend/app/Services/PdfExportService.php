<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Collection;

class PdfExportService
{
    /**
     * Export attendance report as PDF
     */
    public function exportAttendanceReport(Collection $data, array $filters = []): \Barryvdh\DomPDF\PDF
    {
        $summary = [
            'total' => $data->count(),
            'present' => $data->where('status', 'present')->count(),
            'absent' => $data->where('status', 'absent')->count(),
            'late' => $data->where('status', 'late')->count(),
            'excused' => $data->where('status', 'excused')->count(),
        ];

        return Pdf::loadView('pdf.attendance-report', [
            'data' => $data,
            'summary' => $summary,
            'filters' => $filters,
            'generatedAt' => now()->format('Y-m-d H:i'),
        ])->setPaper('a4', 'portrait');
    }

    /**
     * Export payments report as PDF
     */
    public function exportPaymentsReport(Collection $data, array $filters = []): \Barryvdh\DomPDF\PDF
    {
        $summary = [
            'total_count' => $data->count(),
            'total_amount' => $data->sum('amount'),
            'paid_amount' => $data->where('status', 'paid')->sum('amount'),
            'pending_amount' => $data->where('status', 'pending')->sum('amount'),
            'overdue_amount' => $data->where('status', 'overdue')->sum('amount'),
        ];

        return Pdf::loadView('pdf.payments-report', [
            'data' => $data,
            'summary' => $summary,
            'filters' => $filters,
            'generatedAt' => now()->format('Y-m-d H:i'),
        ])->setPaper('a4', 'portrait');
    }

    /**
     * Export students report as PDF
     */
    public function exportStudentsReport(Collection $data, array $filters = []): \Barryvdh\DomPDF\PDF
    {
        return Pdf::loadView('pdf.students-report', [
            'data' => $data,
            'total' => $data->count(),
            'filters' => $filters,
            'generatedAt' => now()->format('Y-m-d H:i'),
        ])->setPaper('a4', 'portrait');
    }

    /**
     * Export performance report as PDF
     */
    public function exportPerformanceReport(Collection $data, array $filters = []): \Barryvdh\DomPDF\PDF
    {
        $summary = [
            'total_students' => $data->count(),
            'average_score' => $data->avg('average_score') ?? 0,
            'pass_rate' => $data->count() > 0
                ? round($data->where('average_score', '>=', 60)->count() / $data->count() * 100, 1)
                : 0,
        ];

        return Pdf::loadView('pdf.performance-report', [
            'data' => $data,
            'summary' => $summary,
            'filters' => $filters,
            'generatedAt' => now()->format('Y-m-d H:i'),
        ])->setPaper('a4', 'portrait');
    }

    /**
     * Export student certificate
     */
    public function exportStudentCertificate(array $studentData): \Barryvdh\DomPDF\PDF
    {
        return Pdf::loadView('pdf.student-certificate', [
            'student' => $studentData,
            'generatedAt' => now()->format('Y-m-d'),
        ])->setPaper('a4', 'landscape');
    }
}
