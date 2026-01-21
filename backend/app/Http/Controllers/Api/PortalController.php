<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Attendance;
use App\Models\ExamResult;
use App\Models\Payment;
use App\Models\QuizAttempt;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class PortalController extends Controller
{
    /**
     * Student/Parent login
     */
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string', // email or phone
            'password' => 'required|string',
        ]);

        $identifier = $request->input('identifier');

        // Find user by email or phone with student/parent role
        $user = User::where(function ($q) use ($identifier) {
            $q->where('email', $identifier)
                ->orWhere('phone', $identifier);
        })
        ->whereIn('role', ['student', 'parent'])
        ->first();

        if (!$user) {
            return response()->json([
                'message' => 'بيانات الدخول غير صحيحة',
            ], 401);
        }

        // Check password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'كلمة المرور غير صحيحة',
            ], 401);
        }

        // Check if user is active
        if (!$user->is_active) {
            return response()->json([
                'message' => 'حسابك غير نشط. يرجى التواصل مع الإدارة.',
            ], 403);
        }

        // Create token
        $token = $user->createToken('portal-token', ['portal:' . $user->role])->plainTextToken;

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
        ];

        if ($user->role === 'student' && $user->studentProfile) {
            $userData['grade_level'] = $user->studentProfile->grade_level;
            $userData['status'] = $user->studentProfile->status;
        }

        return response()->json([
            'token' => $token,
            'user' => $userData,
        ]);
    }

    /**
     * Get user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        $data = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'date_of_birth' => $user->date_of_birth,
            'gender' => $user->gender,
        ];

        if ($user->role === 'student' && $user->studentProfile) {
            $user->load('studentProfile.parent', 'groups');
            $data['grade_level'] = $user->studentProfile->grade_level;
            $data['school_name'] = $user->studentProfile->school_name;
            $data['enrollment_date'] = $user->studentProfile->enrollment_date?->toDateString();
            $data['status'] = $user->studentProfile->status;
            $data['parent'] = $user->studentProfile->parent ? [
                'name' => $user->studentProfile->parent->name,
                'phone' => $user->studentProfile->parent->phone,
            ] : null;
            $data['groups'] = $user->groups->map(function ($g) {
                return [
                    'id' => $g->id,
                    'name' => $g->name,
                ];
            });
        }

        if ($user->role === 'parent') {
            // Get children (students with this parent)
            $children = User::students()
                ->whereHas('studentProfile', function ($q) use ($user) {
                    $q->where('parent_id', $user->id);
                })
                ->with('studentProfile')
                ->get()
                ->map(function ($child) {
                    return [
                        'id' => $child->id,
                        'name' => $child->name,
                        'grade_level' => $child->studentProfile?->grade_level,
                    ];
                });
            $data['children'] = $children;
        }

        return response()->json($data);
    }

    /**
     * Update password
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'كلمة المرور الحالية غير صحيحة',
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'message' => 'تم تغيير كلمة المرور بنجاح',
        ]);
    }

    /**
     * Get dashboard overview
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $studentId = $this->getStudentId($request);

        if (!$studentId) {
            return response()->json(['message' => 'الطالب غير موجود'], 404);
        }

        $student = User::find($studentId);
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        // Attendance stats
        $attendance = Attendance::where('student_id', $studentId)
            ->whereHas('session', function ($q) use ($startOfMonth, $endOfMonth) {
                $q->whereBetween('session_date', [$startOfMonth, $endOfMonth]);
            });

        $totalAttendance = (clone $attendance)->count();
        $presentAttendance = (clone $attendance)->whereIn('status', ['present', 'late'])->count();
        $attendanceRate = $totalAttendance > 0 ? round(($presentAttendance / $totalAttendance) * 100, 1) : 0;

        // Upcoming sessions
        $student->load('groups');
        $groupIds = $student->groups->pluck('id');

        $upcomingSessions = Session::whereIn('group_id', $groupIds)
            ->where('session_date', '>=', $now->toDateString())
            ->where('status', 'scheduled')
            ->orderBy('session_date')
            ->limit(5)
            ->with('group:id,name')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'title' => $s->title,
                    'group_name' => $s->group?->name,
                    'session_date' => $s->session_date->toDateString(),
                    'start_time' => $s->start_time,
                    'end_time' => $s->end_time,
                ];
            });

        // Payment summary
        $pendingPayments = Payment::where('student_id', $studentId)
            ->whereIn('status', ['pending', 'overdue'])
            ->sum('amount');

        $overduePayments = Payment::where('student_id', $studentId)
            ->where('status', 'overdue')
            ->count();

        // Recent exam results
        $recentResults = ExamResult::where('student_id', $studentId)
            ->with('exam:id,title,exam_date,total_marks')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'exam_title' => $r->exam?->title,
                    'exam_date' => $r->exam?->exam_date?->toDateString(),
                    'obtained_marks' => $r->obtained_marks,
                    'total_marks' => $r->exam?->total_marks,
                    'percentage' => $r->percentage,
                    'grade' => $r->grade,
                    'is_passed' => $r->is_passed,
                ];
            });

        // Recent announcements
        $announcements = Announcement::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'type' => $a->type,
                    'priority' => $a->priority,
                    'is_pinned' => $a->is_pinned,
                    'created_at' => $a->created_at->toDateTimeString(),
                ];
            });

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
            ],
            'attendance' => [
                'rate' => $attendanceRate,
                'total' => $totalAttendance,
                'present' => $presentAttendance,
            ],
            'payments' => [
                'pending_amount' => $pendingPayments,
                'overdue_count' => $overduePayments,
            ],
            'upcoming_sessions' => $upcomingSessions,
            'recent_results' => $recentResults,
            'announcements' => $announcements,
        ]);
    }

    /**
     * Get attendance history
     */
    public function attendance(Request $request)
    {
        $studentId = $this->getStudentId($request);

        if (!$studentId) {
            return response()->json(['message' => 'الطالب غير موجود'], 404);
        }

        $query = Attendance::where('student_id', $studentId)
            ->with(['session:id,title,session_date,start_time,end_time,group_id', 'session.group:id,name']);

        if ($request->start_date) {
            $query->whereHas('session', function ($q) use ($request) {
                $q->where('session_date', '>=', $request->start_date);
            });
        }

        if ($request->end_date) {
            $query->whereHas('session', function ($q) use ($request) {
                $q->where('session_date', '<=', $request->end_date);
            });
        }

        $attendances = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        // Calculate summary
        $allAttendances = Attendance::where('student_id', $studentId);
        $total = (clone $allAttendances)->count();
        $present = (clone $allAttendances)->where('status', 'present')->count();
        $late = (clone $allAttendances)->where('status', 'late')->count();
        $absent = (clone $allAttendances)->where('status', 'absent')->count();
        $excused = (clone $allAttendances)->where('status', 'excused')->count();

        return response()->json([
            'summary' => [
                'total' => $total,
                'present' => $present,
                'late' => $late,
                'absent' => $absent,
                'excused' => $excused,
                'rate' => $total > 0 ? round((($present + $late) / $total) * 100, 1) : 0,
            ],
            'data' => $attendances->items(),
            'meta' => [
                'current_page' => $attendances->currentPage(),
                'last_page' => $attendances->lastPage(),
                'per_page' => $attendances->perPage(),
                'total' => $attendances->total(),
            ],
        ]);
    }

    /**
     * Get payments
     */
    public function payments(Request $request)
    {
        $studentId = $this->getStudentId($request);

        if (!$studentId) {
            return response()->json(['message' => 'الطالب غير موجود'], 404);
        }

        $query = Payment::where('student_id', $studentId);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $payments = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        // Calculate summary
        $allPayments = Payment::where('student_id', $studentId);
        $totalPaid = (clone $allPayments)->where('status', 'paid')->sum('amount');
        $totalPending = (clone $allPayments)->where('status', 'pending')->sum('amount');
        $totalOverdue = (clone $allPayments)->where('status', 'overdue')->sum('amount');

        return response()->json([
            'summary' => [
                'total_paid' => $totalPaid,
                'total_pending' => $totalPending,
                'total_overdue' => $totalOverdue,
            ],
            'data' => $payments->items(),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ],
        ]);
    }

    /**
     * Get grades (exams and quizzes)
     */
    public function grades(Request $request)
    {
        $studentId = $this->getStudentId($request);

        if (!$studentId) {
            return response()->json(['message' => 'الطالب غير موجود'], 404);
        }

        // Exam results
        $examResults = ExamResult::where('student_id', $studentId)
            ->with(['exam:id,title,exam_date,total_marks,pass_marks,group_id', 'exam.group:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($r) {
                return [
                    'type' => 'exam',
                    'id' => $r->id,
                    'title' => $r->exam?->title,
                    'date' => $r->exam?->exam_date?->toDateString(),
                    'group_name' => $r->exam?->group?->name,
                    'obtained_marks' => $r->obtained_marks,
                    'total_marks' => $r->exam?->total_marks,
                    'percentage' => $r->percentage,
                    'grade' => $r->grade,
                    'is_passed' => $r->is_passed,
                ];
            });

        // Quiz attempts
        $quizAttempts = QuizAttempt::where('student_id', $studentId)
            ->where('status', 'graded')
            ->with(['quiz:id,title,group_id', 'quiz.group:id,name'])
            ->orderBy('submitted_at', 'desc')
            ->get()
            ->map(function ($a) {
                return [
                    'type' => 'quiz',
                    'id' => $a->id,
                    'title' => $a->quiz?->title,
                    'date' => $a->submitted_at?->toDateString(),
                    'group_name' => $a->quiz?->group?->name,
                    'score' => $a->score,
                    'total_points' => $a->total_points,
                    'percentage' => $a->percentage,
                    'is_passed' => $a->is_passed,
                ];
            });

        // Calculate averages
        $examAverage = $examResults->count() > 0 ? round($examResults->avg('percentage'), 1) : 0;
        $quizAverage = $quizAttempts->count() > 0 ? round($quizAttempts->avg('percentage'), 1) : 0;

        return response()->json([
            'summary' => [
                'exam_count' => $examResults->count(),
                'exam_average' => $examAverage,
                'quiz_count' => $quizAttempts->count(),
                'quiz_average' => $quizAverage,
            ],
            'exams' => $examResults,
            'quizzes' => $quizAttempts,
        ]);
    }

    /**
     * Get schedule
     */
    public function schedule(Request $request)
    {
        $studentId = $this->getStudentId($request);

        if (!$studentId) {
            return response()->json(['message' => 'الطالب غير موجود'], 404);
        }

        $student = User::find($studentId);
        $student->load('groups');
        $groupIds = $student->groups->pluck('id');

        $startDate = $request->input('start_date', now()->startOfWeek()->toDateString());
        $endDate = $request->input('end_date', now()->endOfWeek()->toDateString());

        $sessions = Session::whereIn('group_id', $groupIds)
            ->whereBetween('session_date', [$startDate, $endDate])
            ->with(['group:id,name', 'attendances' => function ($q) use ($studentId) {
                $q->where('student_id', $studentId);
            }])
            ->orderBy('session_date')
            ->orderBy('start_time')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'title' => $s->title,
                    'group_name' => $s->group?->name,
                    'session_date' => $s->session_date->toDateString(),
                    'start_time' => $s->start_time,
                    'end_time' => $s->end_time,
                    'status' => $s->status,
                    'topic' => $s->topic,
                    'attendance_status' => $s->attendances->first()?->status,
                ];
            });

        return response()->json([
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'sessions' => $sessions,
        ]);
    }

    /**
     * Get announcements
     */
    public function announcements(Request $request)
    {
        $announcements = Announcement::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->orderBy('is_pinned', 'desc')
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json([
            'data' => $announcements->items(),
            'meta' => [
                'current_page' => $announcements->currentPage(),
                'last_page' => $announcements->lastPage(),
                'per_page' => $announcements->perPage(),
                'total' => $announcements->total(),
            ],
        ]);
    }

    /**
     * Show single announcement
     */
    public function showAnnouncement(Request $request, Announcement $announcement)
    {
        if (!$announcement->is_active) {
            return response()->json(['message' => 'الإعلان غير متاح'], 404);
        }

        // Mark as read
        $announcement->markAsRead($request->user()->id);

        return response()->json($announcement);
    }

    /**
     * Get children (for parents)
     */
    public function children(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'parent') {
            return response()->json(['message' => 'غير مصرح'], 403);
        }

        $children = User::students()
            ->whereHas('studentProfile', function ($q) use ($user) {
                $q->where('parent_id', $user->id);
            })
            ->with('studentProfile', 'groups')
            ->get()
            ->map(function ($child) {
                return [
                    'id' => $child->id,
                    'name' => $child->name,
                    'grade_level' => $child->studentProfile?->grade_level,
                    'status' => $child->studentProfile?->status,
                    'groups' => $child->groups->map(fn($g) => [
                        'id' => $g->id,
                        'name' => $g->name,
                    ]),
                ];
            });

        return response()->json($children);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح',
        ]);
    }

    /**
     * Get student ID based on user role and request
     */
    protected function getStudentId(Request $request): ?int
    {
        $user = $request->user();

        // If user is a student, return their ID
        if ($user->role === 'student') {
            return $user->id;
        }

        // If user is a parent, check for student_id parameter or return first child
        if ($user->role === 'parent') {
            if ($request->has('student_id')) {
                // Verify the student is their child
                $childExists = User::students()
                    ->where('id', $request->student_id)
                    ->whereHas('studentProfile', function ($q) use ($user) {
                        $q->where('parent_id', $user->id);
                    })
                    ->exists();

                if ($childExists) {
                    return (int) $request->student_id;
                }
                return null;
            }

            // Return first child
            $firstChild = User::students()
                ->whereHas('studentProfile', function ($q) use ($user) {
                    $q->where('parent_id', $user->id);
                })
                ->first();

            return $firstChild?->id;
        }

        return null;
    }
}
