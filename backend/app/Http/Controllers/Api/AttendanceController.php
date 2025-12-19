<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\RecordAttendanceRequest;
use App\Http\Requests\Attendance\UpdateAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\Session;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendance records.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Attendance::with(['session.group', 'student'])
            ->orderBy('created_at', 'desc');

        // Filter by student
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        // Filter by session
        if ($request->has('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereHas('session', function ($q) use ($request) {
                $q->whereBetween('scheduled_at', [$request->start_date, $request->end_date]);
            });
        }

        $perPage = min($request->input('per_page', 15), 100);

        return AttendanceResource::collection($query->paginate($perPage));
    }

    /**
     * Get attendance for a specific session.
     */
    public function sessionAttendance(Session $session): JsonResponse
    {
        $attendances = $session->attendances()->with('student')->get();

        // Get all students in the group
        $groupStudents = $session->group->activeStudents()->get();

        // Map attendance for each student
        $attendanceMap = $attendances->keyBy('student_id');

        $result = $groupStudents->map(function ($student) use ($attendanceMap, $session) {
            $attendance = $attendanceMap->get($student->id);

            return [
                'student_id' => $student->id,
                'student_name' => $student->name,
                'student_phone' => $student->phone,
                'attendance_id' => $attendance?->id,
                'status' => $attendance?->status ?? 'absent',
                'check_in_time' => $attendance?->check_in_time?->toISOString(),
                'notes' => $attendance?->notes,
            ];
        });

        return response()->json([
            'session' => [
                'id' => $session->id,
                'title' => $session->title,
                'scheduled_at' => $session->scheduled_at->toISOString(),
                'group_name' => $session->group->name,
            ],
            'attendances' => $result,
            'summary' => [
                'total' => $groupStudents->count(),
                'present' => $attendances->where('status', 'present')->count(),
                'absent' => $attendances->where('status', 'absent')->count(),
                'late' => $attendances->where('status', 'late')->count(),
                'excused' => $attendances->where('status', 'excused')->count(),
            ],
        ]);
    }

    /**
     * Record attendance for a session.
     */
    public function recordAttendance(RecordAttendanceRequest $request, Session $session): JsonResponse
    {
        // Check if session is not cancelled
        if ($session->status === 'cancelled') {
            return response()->json([
                'message' => 'لا يمكن تسجيل الحضور لجلسة ملغاة',
            ], 422);
        }

        $attendances = $request->attendances;
        $recorded = 0;

        foreach ($attendances as $attendanceData) {
            Attendance::updateOrCreate(
                [
                    'session_id' => $session->id,
                    'student_id' => $attendanceData['student_id'],
                ],
                [
                    'status' => $attendanceData['status'],
                    'check_in_time' => $attendanceData['status'] === 'present' || $attendanceData['status'] === 'late'
                        ? ($attendanceData['check_in_time'] ?? now())
                        : null,
                    'notes' => $attendanceData['notes'] ?? null,
                    'marked_by' => $request->user()->id,
                ]
            );
            $recorded++;
        }

        return response()->json([
            'message' => 'تم تسجيل الحضور بنجاح',
            'recorded_count' => $recorded,
        ]);
    }

    /**
     * Update a single attendance record.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance): JsonResponse
    {
        $attendance->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث سجل الحضور بنجاح',
            'data' => new AttendanceResource($attendance->load(['session', 'student'])),
        ]);
    }

    /**
     * Get attendance report.
     */
    public function report(Request $request): JsonResponse
    {
        $query = Attendance::query();

        // Filter by student
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        // Filter by group
        if ($request->has('group_id')) {
            $query->whereHas('session', function ($q) use ($request) {
                $q->where('group_id', $request->group_id);
            });
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereHas('session', function ($q) use ($request) {
                $q->whereBetween('scheduled_at', [$request->start_date, $request->end_date]);
            });
        }

        $total = $query->count();
        $present = (clone $query)->where('status', 'present')->count();
        $absent = (clone $query)->where('status', 'absent')->count();
        $late = (clone $query)->where('status', 'late')->count();
        $excused = (clone $query)->where('status', 'excused')->count();

        $attendanceRate = $total > 0 ? round((($present + $late) / $total) * 100, 2) : 0;

        return response()->json([
            'summary' => [
                'total_records' => $total,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'excused' => $excused,
                'attendance_rate' => $attendanceRate,
            ],
        ]);
    }
}
