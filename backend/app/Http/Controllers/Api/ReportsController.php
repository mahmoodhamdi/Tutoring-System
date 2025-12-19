<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Group;
use App\Models\Payment;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Session;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * Get available report types
     */
    public function types()
    {
        return response()->json([
            [
                'id' => 'attendance',
                'name' => 'تقرير الحضور',
                'description' => 'تقرير مفصل عن حضور الطلاب',
                'filters' => ['date_range', 'group', 'student', 'status'],
            ],
            [
                'id' => 'payments',
                'name' => 'تقرير المدفوعات',
                'description' => 'تقرير مفصل عن المدفوعات والمستحقات',
                'filters' => ['date_range', 'student', 'status', 'payment_method'],
            ],
            [
                'id' => 'performance',
                'name' => 'تقرير الأداء الأكاديمي',
                'description' => 'تقرير عن أداء الطلاب في الامتحانات والاختبارات',
                'filters' => ['date_range', 'group', 'student'],
            ],
            [
                'id' => 'students',
                'name' => 'تقرير الطلاب',
                'description' => 'قائمة الطلاب مع معلوماتهم الأساسية',
                'filters' => ['status', 'group', 'grade_level'],
            ],
            [
                'id' => 'sessions',
                'name' => 'تقرير الجلسات',
                'description' => 'تقرير عن الجلسات المنعقدة',
                'filters' => ['date_range', 'group', 'status'],
            ],
            [
                'id' => 'financial_summary',
                'name' => 'ملخص مالي',
                'description' => 'ملخص شامل للوضع المالي',
                'filters' => ['date_range'],
            ],
        ]);
    }

    /**
     * Generate attendance report
     */
    public function attendance(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'group_id' => 'nullable|exists:groups,id',
            'student_id' => 'nullable|exists:students,id',
            'status' => 'nullable|in:present,absent,late,excused',
        ]);

        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->startOfMonth();
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now();

        $query = Attendance::with(['student:id,name,phone', 'session:id,title,session_date,group_id', 'session.group:id,name'])
            ->whereHas('session', function ($q) use ($startDate, $endDate, $request) {
                $q->whereBetween('session_date', [$startDate, $endDate]);
                if ($request->group_id) {
                    $q->where('group_id', $request->group_id);
                }
            });

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $attendances = $query->orderBy('created_at', 'desc')->get();

        // Calculate summary
        $summary = [
            'total' => $attendances->count(),
            'present' => $attendances->where('status', 'present')->count(),
            'absent' => $attendances->where('status', 'absent')->count(),
            'late' => $attendances->where('status', 'late')->count(),
            'excused' => $attendances->where('status', 'excused')->count(),
        ];

        $summary['attendance_rate'] = $summary['total'] > 0
            ? round((($summary['present'] + $summary['late']) / $summary['total']) * 100, 1)
            : 0;

        // Group by student
        $byStudent = $attendances->groupBy('student_id')->map(function ($items) {
            $student = $items->first()->student;
            $total = $items->count();
            $present = $items->whereIn('status', ['present', 'late'])->count();

            return [
                'student_id' => $student->id,
                'student_name' => $student->name,
                'total' => $total,
                'present' => $items->where('status', 'present')->count(),
                'absent' => $items->where('status', 'absent')->count(),
                'late' => $items->where('status', 'late')->count(),
                'excused' => $items->where('status', 'excused')->count(),
                'rate' => $total > 0 ? round(($present / $total) * 100, 1) : 0,
            ];
        })->sortBy('rate')->values();

        return response()->json([
            'report_type' => 'attendance',
            'period' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'filters' => $request->only(['group_id', 'student_id', 'status']),
            'summary' => $summary,
            'by_student' => $byStudent,
            'data' => $attendances->map(function ($a) {
                return [
                    'id' => $a->id,
                    'student_name' => $a->student->name,
                    'student_phone' => $a->student->phone,
                    'session_title' => $a->session->title,
                    'session_date' => $a->session->session_date->toDateString(),
                    'group_name' => $a->session->group?->name,
                    'status' => $a->status,
                    'status_label' => $this->getStatusLabel($a->status),
                    'notes' => $a->notes,
                ];
            }),
        ]);
    }

    /**
     * Generate payments report
     */
    public function payments(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'student_id' => 'nullable|exists:students,id',
            'status' => 'nullable|in:paid,pending,overdue,cancelled',
            'payment_method' => 'nullable|string',
        ]);

        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->startOfMonth();
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now();

        $query = Payment::with(['student:id,name,phone'])
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        $payments = $query->orderBy('created_at', 'desc')->get();

        // Calculate summary
        $summary = [
            'total_amount' => $payments->sum('amount'),
            'paid_amount' => $payments->where('status', 'paid')->sum('amount'),
            'pending_amount' => $payments->where('status', 'pending')->sum('amount'),
            'overdue_amount' => $payments->where('status', 'overdue')->sum('amount'),
            'total_count' => $payments->count(),
            'paid_count' => $payments->where('status', 'paid')->count(),
            'pending_count' => $payments->where('status', 'pending')->count(),
            'overdue_count' => $payments->where('status', 'overdue')->count(),
        ];

        $summary['collection_rate'] = ($summary['paid_amount'] + $summary['pending_amount'] + $summary['overdue_amount']) > 0
            ? round(($summary['paid_amount'] / ($summary['paid_amount'] + $summary['pending_amount'] + $summary['overdue_amount'])) * 100, 1)
            : 0;

        // Group by student
        $byStudent = $payments->groupBy('student_id')->map(function ($items) {
            $student = $items->first()->student;
            return [
                'student_id' => $student->id,
                'student_name' => $student->name,
                'total_amount' => $items->sum('amount'),
                'paid_amount' => $items->where('status', 'paid')->sum('amount'),
                'pending_amount' => $items->where('status', 'pending')->sum('amount'),
                'overdue_amount' => $items->where('status', 'overdue')->sum('amount'),
            ];
        })->sortByDesc('overdue_amount')->values();

        // By payment method
        $byMethod = $payments->where('status', 'paid')->groupBy('payment_method')->map(function ($items, $method) {
            return [
                'method' => $method,
                'count' => $items->count(),
                'amount' => $items->sum('amount'),
            ];
        })->values();

        return response()->json([
            'report_type' => 'payments',
            'period' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'filters' => $request->only(['student_id', 'status', 'payment_method']),
            'summary' => $summary,
            'by_student' => $byStudent,
            'by_method' => $byMethod,
            'data' => $payments->map(function ($p) {
                return [
                    'id' => $p->id,
                    'student_name' => $p->student->name,
                    'student_phone' => $p->student->phone,
                    'amount' => $p->amount,
                    'status' => $p->status,
                    'status_label' => $this->getPaymentStatusLabel($p->status),
                    'payment_method' => $p->payment_method,
                    'payment_date' => $p->payment_date?->toDateString(),
                    'due_date' => $p->due_date?->toDateString(),
                    'description' => $p->description,
                    'created_at' => $p->created_at->toDateTimeString(),
                ];
            }),
        ]);
    }

    /**
     * Generate performance report
     */
    public function performance(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'group_id' => 'nullable|exists:groups,id',
            'student_id' => 'nullable|exists:students,id',
        ]);

        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->startOfMonth();
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now();

        // Get exam results
        $examResultsQuery = ExamResult::with(['student:id,name', 'exam:id,title,exam_date,total_marks,pass_marks,group_id', 'exam.group:id,name'])
            ->whereHas('exam', function ($q) use ($startDate, $endDate, $request) {
                $q->whereBetween('exam_date', [$startDate, $endDate]);
                if ($request->group_id) {
                    $q->where('group_id', $request->group_id);
                }
            });

        if ($request->student_id) {
            $examResultsQuery->where('student_id', $request->student_id);
        }

        $examResults = $examResultsQuery->get();

        // Get quiz attempts
        $quizAttemptsQuery = QuizAttempt::with(['student:id,name', 'quiz:id,title,group_id', 'quiz.group:id,name'])
            ->whereBetween('submitted_at', [$startDate, $endDate])
            ->where('status', 'graded');

        if ($request->group_id) {
            $quizAttemptsQuery->whereHas('quiz', function ($q) use ($request) {
                $q->where('group_id', $request->group_id);
            });
        }

        if ($request->student_id) {
            $quizAttemptsQuery->where('student_id', $request->student_id);
        }

        $quizAttempts = $quizAttemptsQuery->get();

        // Calculate exam summary
        $examSummary = [
            'total_exams' => $examResults->pluck('exam_id')->unique()->count(),
            'total_results' => $examResults->count(),
            'average_percentage' => $examResults->count() > 0 ? round($examResults->avg('percentage'), 1) : 0,
            'pass_count' => $examResults->where('is_passed', true)->count(),
            'fail_count' => $examResults->where('is_passed', false)->count(),
            'pass_rate' => $examResults->count() > 0
                ? round(($examResults->where('is_passed', true)->count() / $examResults->count()) * 100, 1)
                : 0,
        ];

        // Calculate quiz summary
        $quizSummary = [
            'total_quizzes' => $quizAttempts->pluck('quiz_id')->unique()->count(),
            'total_attempts' => $quizAttempts->count(),
            'average_percentage' => $quizAttempts->count() > 0 ? round($quizAttempts->avg('percentage'), 1) : 0,
            'pass_count' => $quizAttempts->where('is_passed', true)->count(),
            'fail_count' => $quizAttempts->where('is_passed', false)->count(),
            'pass_rate' => $quizAttempts->count() > 0
                ? round(($quizAttempts->where('is_passed', true)->count() / $quizAttempts->count()) * 100, 1)
                : 0,
        ];

        // Performance by student
        $studentIds = $examResults->pluck('student_id')
            ->merge($quizAttempts->pluck('student_id'))
            ->unique();

        $byStudent = $studentIds->map(function ($studentId) use ($examResults, $quizAttempts) {
            $studentExams = $examResults->where('student_id', $studentId);
            $studentQuizzes = $quizAttempts->where('student_id', $studentId);
            $student = $studentExams->first()?->student ?? $studentQuizzes->first()?->student;

            $examAvg = $studentExams->count() > 0 ? round($studentExams->avg('percentage'), 1) : 0;
            $quizAvg = $studentQuizzes->count() > 0 ? round($studentQuizzes->avg('percentage'), 1) : 0;

            $count = ($examAvg > 0 ? 1 : 0) + ($quizAvg > 0 ? 1 : 0);
            $overallAvg = $count > 0 ? round(($examAvg + $quizAvg) / $count, 1) : 0;

            return [
                'student_id' => $studentId,
                'student_name' => $student?->name,
                'exam_count' => $studentExams->count(),
                'exam_average' => $examAvg,
                'quiz_count' => $studentQuizzes->count(),
                'quiz_average' => $quizAvg,
                'overall_average' => $overallAvg,
            ];
        })->sortByDesc('overall_average')->values();

        return response()->json([
            'report_type' => 'performance',
            'period' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'filters' => $request->only(['group_id', 'student_id']),
            'exam_summary' => $examSummary,
            'quiz_summary' => $quizSummary,
            'by_student' => $byStudent,
            'exam_results' => $examResults->map(function ($r) {
                return [
                    'id' => $r->id,
                    'student_name' => $r->student->name,
                    'exam_title' => $r->exam->title,
                    'exam_date' => $r->exam->exam_date->toDateString(),
                    'group_name' => $r->exam->group?->name,
                    'obtained_marks' => $r->obtained_marks,
                    'total_marks' => $r->exam->total_marks,
                    'percentage' => $r->percentage,
                    'is_passed' => $r->is_passed,
                    'grade' => $r->grade,
                ];
            }),
            'quiz_attempts' => $quizAttempts->map(function ($a) {
                return [
                    'id' => $a->id,
                    'student_name' => $a->student->name,
                    'quiz_title' => $a->quiz->title,
                    'submitted_at' => $a->submitted_at->toDateTimeString(),
                    'group_name' => $a->quiz->group?->name,
                    'score' => $a->score,
                    'total_points' => $a->total_points,
                    'percentage' => $a->percentage,
                    'is_passed' => $a->is_passed,
                ];
            }),
        ]);
    }

    /**
     * Generate students report
     */
    public function students(Request $request)
    {
        $request->validate([
            'status' => 'nullable|in:active,inactive,graduated',
            'group_id' => 'nullable|exists:groups,id',
            'grade_level' => 'nullable|string',
        ]);

        $query = Student::with(['groups:id,name']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->group_id) {
            $query->whereHas('groups', function ($q) use ($request) {
                $q->where('groups.id', $request->group_id);
            });
        }

        if ($request->grade_level) {
            $query->where('grade_level', $request->grade_level);
        }

        $students = $query->orderBy('name')->get();

        // Summary
        $summary = [
            'total' => $students->count(),
            'active' => $students->where('status', 'active')->count(),
            'inactive' => $students->where('status', 'inactive')->count(),
            'graduated' => $students->where('status', 'graduated')->count(),
        ];

        // By grade level
        $byGrade = $students->groupBy('grade_level')->map(function ($items, $grade) {
            return [
                'grade_level' => $grade,
                'count' => $items->count(),
            ];
        })->values();

        return response()->json([
            'report_type' => 'students',
            'filters' => $request->only(['status', 'group_id', 'grade_level']),
            'summary' => $summary,
            'by_grade' => $byGrade,
            'data' => $students->map(function ($s) {
                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'email' => $s->email,
                    'phone' => $s->phone,
                    'grade_level' => $s->grade_level,
                    'status' => $s->status,
                    'status_label' => $this->getStudentStatusLabel($s->status),
                    'groups' => $s->groups->pluck('name')->join(', '),
                    'parent_name' => $s->parent_name,
                    'parent_phone' => $s->parent_phone,
                    'enrollment_date' => $s->enrollment_date?->toDateString(),
                    'created_at' => $s->created_at->toDateString(),
                ];
            }),
        ]);
    }

    /**
     * Generate sessions report
     */
    public function sessions(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'group_id' => 'nullable|exists:groups,id',
            'status' => 'nullable|in:scheduled,completed,cancelled',
        ]);

        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->startOfMonth();
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now();

        $query = Session::with(['group:id,name'])
            ->withCount('attendances')
            ->whereBetween('session_date', [$startDate, $endDate]);

        if ($request->group_id) {
            $query->where('group_id', $request->group_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $sessions = $query->orderBy('session_date', 'desc')->get();

        // Summary
        $summary = [
            'total' => $sessions->count(),
            'completed' => $sessions->where('status', 'completed')->count(),
            'scheduled' => $sessions->where('status', 'scheduled')->count(),
            'cancelled' => $sessions->where('status', 'cancelled')->count(),
            'total_duration_hours' => round($sessions->sum(function ($s) {
                $start = Carbon::parse($s->start_time);
                $end = Carbon::parse($s->end_time);
                return $start->diffInMinutes($end) / 60;
            }), 1),
        ];

        // By group
        $byGroup = $sessions->groupBy('group_id')->map(function ($items) {
            $group = $items->first()->group;
            return [
                'group_id' => $group?->id,
                'group_name' => $group?->name ?? 'بدون مجموعة',
                'count' => $items->count(),
                'completed' => $items->where('status', 'completed')->count(),
            ];
        })->values();

        return response()->json([
            'report_type' => 'sessions',
            'period' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'filters' => $request->only(['group_id', 'status']),
            'summary' => $summary,
            'by_group' => $byGroup,
            'data' => $sessions->map(function ($s) {
                return [
                    'id' => $s->id,
                    'title' => $s->title,
                    'group_name' => $s->group?->name,
                    'session_date' => $s->session_date->toDateString(),
                    'start_time' => $s->start_time,
                    'end_time' => $s->end_time,
                    'status' => $s->status,
                    'status_label' => $this->getSessionStatusLabel($s->status),
                    'attendances_count' => $s->attendances_count,
                    'topic' => $s->topic,
                ];
            }),
        ]);
    }

    /**
     * Generate financial summary report
     */
    public function financialSummary(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->startOfYear();
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now();

        // Overall summary
        $allPayments = Payment::whereBetween('created_at', [$startDate, $endDate]);

        $summary = [
            'total_revenue' => (clone $allPayments)->where('status', 'paid')->sum('amount'),
            'total_pending' => (clone $allPayments)->where('status', 'pending')->sum('amount'),
            'total_overdue' => (clone $allPayments)->where('status', 'overdue')->sum('amount'),
            'total_expected' => $allPayments->sum('amount'),
        ];

        $summary['collection_rate'] = $summary['total_expected'] > 0
            ? round(($summary['total_revenue'] / $summary['total_expected']) * 100, 1)
            : 0;

        // Monthly breakdown
        $monthly = [];
        $current = $startDate->copy()->startOfMonth();

        while ($current <= $endDate) {
            $monthEnd = $current->copy()->endOfMonth();

            $monthPayments = Payment::whereBetween('created_at', [$current, $monthEnd]);

            $monthly[] = [
                'month' => $current->format('Y-m'),
                'label' => $current->locale('ar')->translatedFormat('F Y'),
                'revenue' => (clone $monthPayments)->where('status', 'paid')->sum('amount'),
                'pending' => (clone $monthPayments)->where('status', 'pending')->sum('amount'),
                'overdue' => (clone $monthPayments)->where('status', 'overdue')->sum('amount'),
                'count' => $monthPayments->count(),
            ];

            $current->addMonth();
        }

        // Top paying students
        $topStudents = Payment::where('status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select('student_id', DB::raw('SUM(amount) as total'))
            ->groupBy('student_id')
            ->orderByDesc('total')
            ->limit(10)
            ->with('student:id,name')
            ->get()
            ->map(function ($p) {
                return [
                    'student_id' => $p->student_id,
                    'student_name' => $p->student?->name,
                    'total' => $p->total,
                ];
            });

        // Students with outstanding balance
        $outstandingStudents = Payment::whereIn('status', ['pending', 'overdue'])
            ->select('student_id', DB::raw('SUM(amount) as total'))
            ->groupBy('student_id')
            ->orderByDesc('total')
            ->limit(10)
            ->with('student:id,name')
            ->get()
            ->map(function ($p) {
                return [
                    'student_id' => $p->student_id,
                    'student_name' => $p->student?->name,
                    'outstanding' => $p->total,
                ];
            });

        return response()->json([
            'report_type' => 'financial_summary',
            'period' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'summary' => $summary,
            'monthly' => $monthly,
            'top_students' => $topStudents,
            'outstanding_students' => $outstandingStudents,
        ]);
    }

    /**
     * Export report to CSV
     */
    public function exportCsv(Request $request)
    {
        $request->validate([
            'report_type' => 'required|in:attendance,payments,performance,students,sessions',
        ]);

        $reportType = $request->input('report_type');
        $data = [];

        // Get report data based on type
        switch ($reportType) {
            case 'attendance':
                $response = $this->attendance($request);
                $data = json_decode($response->getContent(), true)['data'];
                $headers = ['الطالب', 'الهاتف', 'الجلسة', 'التاريخ', 'المجموعة', 'الحالة', 'ملاحظات'];
                $fields = ['student_name', 'student_phone', 'session_title', 'session_date', 'group_name', 'status_label', 'notes'];
                break;

            case 'payments':
                $response = $this->payments($request);
                $data = json_decode($response->getContent(), true)['data'];
                $headers = ['الطالب', 'الهاتف', 'المبلغ', 'الحالة', 'طريقة الدفع', 'تاريخ الدفع', 'تاريخ الاستحقاق', 'الوصف'];
                $fields = ['student_name', 'student_phone', 'amount', 'status_label', 'payment_method', 'payment_date', 'due_date', 'description'];
                break;

            case 'students':
                $response = $this->students($request);
                $data = json_decode($response->getContent(), true)['data'];
                $headers = ['الاسم', 'البريد الإلكتروني', 'الهاتف', 'المرحلة', 'الحالة', 'المجموعات', 'ولي الأمر', 'هاتف ولي الأمر', 'تاريخ التسجيل'];
                $fields = ['name', 'email', 'phone', 'grade_level', 'status_label', 'groups', 'parent_name', 'parent_phone', 'enrollment_date'];
                break;

            case 'sessions':
                $response = $this->sessions($request);
                $data = json_decode($response->getContent(), true)['data'];
                $headers = ['العنوان', 'المجموعة', 'التاريخ', 'من', 'إلى', 'الحالة', 'عدد الحضور', 'الموضوع'];
                $fields = ['title', 'group_name', 'session_date', 'start_time', 'end_time', 'status_label', 'attendances_count', 'topic'];
                break;

            default:
                return response()->json(['error' => 'نوع التقرير غير مدعوم للتصدير'], 400);
        }

        // Generate CSV
        $csv = implode(',', $headers) . "\n";

        foreach ($data as $row) {
            $values = [];
            foreach ($fields as $field) {
                $value = $row[$field] ?? '';
                // Escape quotes and wrap in quotes
                $value = '"' . str_replace('"', '""', $value) . '"';
                $values[] = $value;
            }
            $csv .= implode(',', $values) . "\n";
        }

        // Add BOM for UTF-8
        $csv = "\xEF\xBB\xBF" . $csv;

        return response($csv)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="report_' . $reportType . '_' . now()->format('Y-m-d') . '.csv"');
    }

    /**
     * Helper methods for status labels
     */
    protected function getStatusLabel(string $status): string
    {
        return match ($status) {
            'present' => 'حاضر',
            'absent' => 'غائب',
            'late' => 'متأخر',
            'excused' => 'مستأذن',
            default => $status,
        };
    }

    protected function getPaymentStatusLabel(string $status): string
    {
        return match ($status) {
            'paid' => 'مدفوع',
            'pending' => 'معلق',
            'overdue' => 'متأخر',
            'cancelled' => 'ملغي',
            default => $status,
        };
    }

    protected function getStudentStatusLabel(string $status): string
    {
        return match ($status) {
            'active' => 'نشط',
            'inactive' => 'غير نشط',
            'graduated' => 'متخرج',
            default => $status,
        };
    }

    protected function getSessionStatusLabel(string $status): string
    {
        return match ($status) {
            'scheduled' => 'مجدول',
            'completed' => 'مكتمل',
            'cancelled' => 'ملغي',
            default => $status,
        };
    }
}
