<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Group;
use App\Models\Session;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get main dashboard statistics
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get date range for statistics
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->startOfMonth();
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now()->endOfMonth();

        return response()->json([
            'overview' => $this->getOverviewStats(),
            'students' => $this->getStudentStats($startDate, $endDate),
            'sessions' => $this->getSessionStats($startDate, $endDate),
            'attendance' => $this->getAttendanceStats($startDate, $endDate),
            'payments' => $this->getPaymentStats($startDate, $endDate),
            'performance' => $this->getPerformanceStats($startDate, $endDate),
        ]);
    }

    /**
     * Get overview statistics
     */
    protected function getOverviewStats(): array
    {
        return [
            'total_students' => User::students()->where('is_active', true)->count(),
            'total_groups' => Group::active()->count(),
            'total_sessions' => Session::count(),
            'total_exams' => Exam::count(),
            'total_quizzes' => Quiz::where('is_active', true)->count(),
            'active_announcements' => Announcement::published()
                ->where(function ($query) {
                    $query->whereNull('expires_at')
                        ->orWhere('expires_at', '>', now());
                })->count(),
        ];
    }

    /**
     * Get student statistics
     */
    protected function getStudentStats(Carbon $startDate, Carbon $endDate): array
    {
        $newStudents = User::students()->whereBetween('created_at', [$startDate, $endDate])->count();
        $activeStudents = User::students()->where('is_active', true)->count();
        $inactiveStudents = User::students()->where('is_active', false)->count();

        // Students by grade level
        $byGrade = User::students()
            ->where('is_active', true)
            ->whereHas('studentProfile')
            ->join('student_profiles', 'users.id', '=', 'student_profiles.user_id')
            ->select('student_profiles.grade_level', DB::raw('count(*) as count'))
            ->groupBy('student_profiles.grade_level')
            ->pluck('count', 'grade_level')
            ->toArray();

        // Students by group
        $byGroup = Group::withCount(['students' => function ($query) {
            $query->where('users.is_active', true);
        }])->get()->map(function ($group) {
            return [
                'name' => $group->name,
                'count' => $group->students_count,
            ];
        });

        return [
            'new' => $newStudents,
            'active' => $activeStudents,
            'inactive' => $inactiveStudents,
            'total' => $activeStudents + $inactiveStudents,
            'by_grade' => $byGrade,
            'by_group' => $byGroup,
        ];
    }

    /**
     * Get session statistics
     */
    protected function getSessionStats(Carbon $startDate, Carbon $endDate): array
    {
        $sessions = Session::whereBetween('session_date', [$startDate, $endDate]);

        $completed = (clone $sessions)->where('status', 'completed')->count();
        $scheduled = (clone $sessions)->where('status', 'scheduled')->count();
        $cancelled = (clone $sessions)->where('status', 'cancelled')->count();
        $total = $sessions->count();

        // Sessions by day of week - using strftime for SQLite compatibility
        $byDayOfWeek = Session::whereBetween('session_date', [$startDate, $endDate])
            ->select(DB::raw("CAST(strftime('%w', session_date) AS INTEGER) + 1 as day"), DB::raw('count(*) as count'))
            ->groupBy('day')
            ->pluck('count', 'day')
            ->toArray();

        // Upcoming sessions
        $upcoming = Session::where('session_date', '>=', now())
            ->where('status', 'scheduled')
            ->orderBy('session_date')
            ->limit(5)
            ->with('group')
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'title' => $session->title,
                    'group_name' => $session->group->name ?? null,
                    'session_date' => $session->session_date->toDateString(),
                    'start_time' => $session->start_time,
                    'end_time' => $session->end_time,
                ];
            });

        return [
            'completed' => $completed,
            'scheduled' => $scheduled,
            'cancelled' => $cancelled,
            'total' => $total,
            'by_day_of_week' => $byDayOfWeek,
            'upcoming' => $upcoming,
        ];
    }

    /**
     * Get attendance statistics
     */
    protected function getAttendanceStats(Carbon $startDate, Carbon $endDate): array
    {
        $attendance = Attendance::whereHas('session', function ($query) use ($startDate, $endDate) {
            $query->whereBetween('session_date', [$startDate, $endDate]);
        });

        $present = (clone $attendance)->where('status', 'present')->count();
        $absent = (clone $attendance)->where('status', 'absent')->count();
        $late = (clone $attendance)->where('status', 'late')->count();
        $excused = (clone $attendance)->where('status', 'excused')->count();
        $total = $attendance->count();

        // Calculate attendance rate
        $attendanceRate = $total > 0 ? round((($present + $late) / $total) * 100, 1) : 0;

        // Attendance trend (by week)
        $trend = $this->getAttendanceTrend($startDate, $endDate);

        // Students with low attendance (below 75%)
        $lowAttendanceStudents = $this->getLowAttendanceStudents($startDate, $endDate);

        return [
            'present' => $present,
            'absent' => $absent,
            'late' => $late,
            'excused' => $excused,
            'total' => $total,
            'rate' => $attendanceRate,
            'trend' => $trend,
            'low_attendance_students' => $lowAttendanceStudents,
        ];
    }

    /**
     * Get attendance trend by week
     */
    protected function getAttendanceTrend(Carbon $startDate, Carbon $endDate): array
    {
        $trend = [];
        $current = $startDate->copy()->startOfWeek();

        while ($current <= $endDate) {
            $weekEnd = $current->copy()->endOfWeek();

            $weekAttendance = Attendance::whereHas('session', function ($query) use ($current, $weekEnd) {
                $query->whereBetween('session_date', [$current, $weekEnd]);
            });

            $total = (clone $weekAttendance)->count();
            $present = (clone $weekAttendance)->whereIn('status', ['present', 'late'])->count();

            $trend[] = [
                'week' => $current->format('Y-m-d'),
                'label' => $current->format('d M'),
                'rate' => $total > 0 ? round(($present / $total) * 100, 1) : 0,
                'total' => $total,
            ];

            $current->addWeek();
        }

        return $trend;
    }

    /**
     * Get students with low attendance
     */
    protected function getLowAttendanceStudents(Carbon $startDate, Carbon $endDate, float $threshold = 75): array
    {
        $students = User::students()
            ->where('is_active', true)
            ->withCount([
                'attendances as total_attendance' => function ($query) use ($startDate, $endDate) {
                    $query->whereHas('session', function ($q) use ($startDate, $endDate) {
                        $q->whereBetween('session_date', [$startDate, $endDate]);
                    });
                },
                'attendances as present_attendance' => function ($query) use ($startDate, $endDate) {
                    $query->whereHas('session', function ($q) use ($startDate, $endDate) {
                        $q->whereBetween('session_date', [$startDate, $endDate]);
                    })->whereIn('status', ['present', 'late']);
                },
            ])
            ->get()
            ->filter(function ($student) use ($threshold) {
                // Skip students with no attendance
                if ($student->total_attendance === 0) {
                    return false;
                }
                $rate = ($student->present_attendance / $student->total_attendance) * 100;
                return $rate < $threshold;
            })
            ->map(function ($student) {
                $rate = round(($student->present_attendance / $student->total_attendance) * 100, 1);
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'rate' => $rate,
                    'total' => $student->total_attendance,
                    'present' => $student->present_attendance,
                ];
            })
            ->sortBy('rate')
            ->take(10)
            ->values()
            ->toArray();

        return $students;
    }

    /**
     * Get payment statistics
     */
    protected function getPaymentStats(Carbon $startDate, Carbon $endDate): array
    {
        $payments = Payment::whereBetween('created_at', [$startDate, $endDate]);

        $totalPaid = (clone $payments)->where('status', 'paid')->sum('amount');
        $totalPending = (clone $payments)->where('status', 'pending')->sum('amount');
        $totalOverdue = (clone $payments)->where('status', 'overdue')->sum('amount');

        $paidCount = (clone $payments)->where('status', 'paid')->count();
        $pendingCount = (clone $payments)->where('status', 'pending')->count();
        $overdueCount = (clone $payments)->where('status', 'overdue')->count();

        // Collection rate
        $totalExpected = $totalPaid + $totalPending + $totalOverdue;
        $collectionRate = $totalExpected > 0 ? round(($totalPaid / $totalExpected) * 100, 1) : 0;

        // Payment trend by month
        $trend = $this->getPaymentTrend($startDate, $endDate);

        // Students with overdue payments
        $overdueStudents = User::students()
            ->whereHas('payments', function ($query) {
                $query->where('status', 'overdue');
            })
            ->with(['payments' => function ($query) {
                $query->where('status', 'overdue');
            }])
            ->limit(10)
            ->get()
            ->map(function ($student) {
                $totalOverdue = $student->payments->sum('amount');
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'overdue_amount' => $totalOverdue,
                    'overdue_count' => $student->payments->count(),
                ];
            });

        return [
            'total_paid' => $totalPaid,
            'total_pending' => $totalPending,
            'total_overdue' => $totalOverdue,
            'paid_count' => $paidCount,
            'pending_count' => $pendingCount,
            'overdue_count' => $overdueCount,
            'collection_rate' => $collectionRate,
            'trend' => $trend,
            'overdue_students' => $overdueStudents,
        ];
    }

    /**
     * Get payment trend by month
     */
    protected function getPaymentTrend(Carbon $startDate, Carbon $endDate): array
    {
        $trend = [];
        $current = $startDate->copy()->startOfMonth();

        while ($current <= $endDate) {
            $monthEnd = $current->copy()->endOfMonth();

            $monthPayments = Payment::whereBetween('created_at', [$current, $monthEnd]);

            $trend[] = [
                'month' => $current->format('Y-m'),
                'label' => $current->format('M Y'),
                'paid' => (clone $monthPayments)->where('status', 'paid')->sum('amount'),
                'pending' => (clone $monthPayments)->where('status', 'pending')->sum('amount'),
                'overdue' => (clone $monthPayments)->where('status', 'overdue')->sum('amount'),
            ];

            $current->addMonth();
        }

        return $trend;
    }

    /**
     * Get academic performance statistics
     */
    protected function getPerformanceStats(Carbon $startDate, Carbon $endDate): array
    {
        // Exam statistics
        $examResults = ExamResult::whereHas('exam', function ($query) use ($startDate, $endDate) {
            $query->whereBetween('exam_date', [$startDate, $endDate]);
        });

        $examAverage = (clone $examResults)->avg('percentage') ?? 0;
        $examPassRate = $this->calculateExamPassRate($startDate, $endDate);

        // Quiz statistics
        $quizAttempts = QuizAttempt::whereBetween('submitted_at', [$startDate, $endDate])
            ->where('status', 'graded');

        $quizAverage = (clone $quizAttempts)->avg('percentage') ?? 0;
        $quizPassRate = $this->calculateQuizPassRate($startDate, $endDate);

        // Top performers
        $topPerformers = $this->getTopPerformers($startDate, $endDate);

        // Students needing attention (low performance)
        $needsAttention = $this->getStudentsNeedingAttention($startDate, $endDate);

        // Performance by subject/group
        $byGroup = $this->getPerformanceByGroup($startDate, $endDate);

        return [
            'exam_average' => round($examAverage, 1),
            'exam_pass_rate' => $examPassRate,
            'quiz_average' => round($quizAverage, 1),
            'quiz_pass_rate' => $quizPassRate,
            'top_performers' => $topPerformers,
            'needs_attention' => $needsAttention,
            'by_group' => $byGroup,
        ];
    }

    /**
     * Calculate exam pass rate
     */
    protected function calculateExamPassRate(Carbon $startDate, Carbon $endDate): float
    {
        $total = ExamResult::whereHas('exam', function ($query) use ($startDate, $endDate) {
            $query->whereBetween('exam_date', [$startDate, $endDate]);
        })->count();

        if ($total === 0) return 0;

        $passed = ExamResult::whereHas('exam', function ($query) use ($startDate, $endDate) {
            $query->whereBetween('exam_date', [$startDate, $endDate]);
        })->where('is_passed', true)->count();

        return round(($passed / $total) * 100, 1);
    }

    /**
     * Calculate quiz pass rate
     */
    protected function calculateQuizPassRate(Carbon $startDate, Carbon $endDate): float
    {
        $total = QuizAttempt::whereBetween('submitted_at', [$startDate, $endDate])
            ->where('status', 'graded')
            ->count();

        if ($total === 0) return 0;

        $passed = QuizAttempt::whereBetween('submitted_at', [$startDate, $endDate])
            ->where('status', 'graded')
            ->where('is_passed', true)
            ->count();

        return round(($passed / $total) * 100, 1);
    }

    /**
     * Get top performing students
     */
    protected function getTopPerformers(Carbon $startDate, Carbon $endDate, int $limit = 5): array
    {
        // Combine exam and quiz performance
        $students = User::students()
            ->where('is_active', true)
            ->withAvg(['examResults as exam_avg' => function ($query) use ($startDate, $endDate) {
                $query->whereHas('exam', function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('exam_date', [$startDate, $endDate]);
                });
            }], 'percentage')
            ->withAvg(['quizAttempts as quiz_avg' => function ($query) use ($startDate, $endDate) {
                $query->whereBetween('submitted_at', [$startDate, $endDate])
                    ->where('status', 'graded');
            }], 'percentage')
            ->get()
            ->map(function ($student) {
                $examAvg = $student->exam_avg ?? 0;
                $quizAvg = $student->quiz_avg ?? 0;
                $count = ($examAvg > 0 ? 1 : 0) + ($quizAvg > 0 ? 1 : 0);
                $average = $count > 0 ? ($examAvg + $quizAvg) / $count : 0;

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'exam_avg' => round($examAvg, 1),
                    'quiz_avg' => round($quizAvg, 1),
                    'average' => round($average, 1),
                ];
            })
            ->filter(fn($s) => $s['average'] > 0)
            ->sortByDesc('average')
            ->take($limit)
            ->values()
            ->toArray();

        return $students;
    }

    /**
     * Get students needing attention (low performance)
     */
    protected function getStudentsNeedingAttention(Carbon $startDate, Carbon $endDate, float $threshold = 60, int $limit = 5): array
    {
        $students = User::students()
            ->where('is_active', true)
            ->withAvg(['examResults as exam_avg' => function ($query) use ($startDate, $endDate) {
                $query->whereHas('exam', function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('exam_date', [$startDate, $endDate]);
                });
            }], 'percentage')
            ->withAvg(['quizAttempts as quiz_avg' => function ($query) use ($startDate, $endDate) {
                $query->whereBetween('submitted_at', [$startDate, $endDate])
                    ->where('status', 'graded');
            }], 'percentage')
            ->get()
            ->map(function ($student) {
                $examAvg = $student->exam_avg ?? 0;
                $quizAvg = $student->quiz_avg ?? 0;
                $count = ($examAvg > 0 ? 1 : 0) + ($quizAvg > 0 ? 1 : 0);
                $average = $count > 0 ? ($examAvg + $quizAvg) / $count : 0;

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'exam_avg' => round($examAvg, 1),
                    'quiz_avg' => round($quizAvg, 1),
                    'average' => round($average, 1),
                ];
            })
            ->filter(fn($s) => $s['average'] > 0 && $s['average'] < $threshold)
            ->sortBy('average')
            ->take($limit)
            ->values()
            ->toArray();

        return $students;
    }

    /**
     * Get performance by group
     */
    protected function getPerformanceByGroup(Carbon $startDate, Carbon $endDate): array
    {
        return Group::active()
            ->get()
            ->map(function ($group) use ($startDate, $endDate) {
                // Calculate exam average for group
                $examAvg = ExamResult::whereHas('student', function ($query) use ($group) {
                    $query->whereHas('groups', function ($q) use ($group) {
                        $q->where('groups.id', $group->id);
                    });
                })
                ->whereHas('exam', function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('exam_date', [$startDate, $endDate]);
                })
                ->avg('percentage') ?? 0;

                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'student_count' => $group->students()->where('users.is_active', true)->count(),
                    'exam_avg' => round($examAvg, 1),
                ];
            })
            ->toArray();
    }

    /**
     * Get recent activities
     */
    public function recentActivities(Request $request)
    {
        $limit = $request->input('limit', 10);
        $activities = [];

        // Recent sessions
        $recentSessions = Session::with('group')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($session) {
                return [
                    'type' => 'session',
                    'title' => 'جلسة جديدة: ' . $session->title,
                    'description' => $session->group?->name ?? 'بدون مجموعة',
                    'date' => $session->created_at,
                    'link' => '/dashboard/sessions/' . $session->id,
                ];
            });

        // Recent payments
        $recentPayments = Payment::with('student')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($payment) {
                return [
                    'type' => 'payment',
                    'title' => 'دفعة: ' . number_format($payment->amount) . ' ج.م',
                    'description' => $payment->student?->name ?? 'طالب',
                    'date' => $payment->created_at,
                    'link' => '/dashboard/payments/' . $payment->id,
                ];
            });

        // Recent exam results
        $recentResults = ExamResult::with(['student', 'exam'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($result) {
                return [
                    'type' => 'exam_result',
                    'title' => 'نتيجة امتحان: ' . ($result->exam?->title ?? 'امتحان'),
                    'description' => ($result->student?->name ?? 'طالب') . ' - ' . $result->percentage . '%',
                    'date' => $result->created_at,
                    'link' => '/dashboard/exams/' . $result->exam_id,
                ];
            });

        // Combine and sort by date
        $activities = collect()
            ->merge($recentSessions)
            ->merge($recentPayments)
            ->merge($recentResults)
            ->sortByDesc('date')
            ->take($limit)
            ->values()
            ->toArray();

        return response()->json($activities);
    }

    /**
     * Get quick stats for header/widget
     */
    public function quickStats(Request $request)
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        return response()->json([
            'today_sessions' => Session::whereDate('session_date', $today)->count(),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'overdue_payments' => Payment::where('status', 'overdue')->count(),
            'unread_notifications' => $request->user()->notifications()
                ->where('is_read', false)
                ->count(),
            'new_students_this_month' => User::students()->where('created_at', '>=', $thisMonth)->count(),
            'upcoming_exams' => Exam::where('exam_date', '>=', $today)
                ->where('exam_date', '<=', $today->copy()->addWeek())
                ->count(),
        ]);
    }
}
