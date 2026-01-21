<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    /**
     * Display a listing of students.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = User::students()
            ->with('studentProfile')
            ->when($request->search, function ($q, $search) {
                $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($q, $status) {
                $q->whereHas('studentProfile', function ($query) use ($status) {
                    $query->where('status', $status);
                });
            })
            ->when($request->grade_level, function ($q, $gradeLevel) {
                $q->whereHas('studentProfile', function ($query) use ($gradeLevel) {
                    $query->where('grade_level', $gradeLevel);
                });
            })
            ->when($request->is_active !== null, function ($q) use ($request) {
                $q->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
            });

        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = min($request->per_page ?? 15, 100);
        $students = $query->paginate($perPage);

        return StudentResource::collection($students);
    }

    /**
     * Store a newly created student.
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $student = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'],
                'password' => Hash::make($validated['password']),
                'role' => 'student',
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            $user->studentProfile()->create([
                'parent_id' => $validated['parent_id'] ?? null,
                'grade_level' => $validated['grade_level'] ?? null,
                'school_name' => $validated['school_name'] ?? null,
                'address' => $validated['address'] ?? null,
                'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
                'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'enrollment_date' => $validated['enrollment_date'] ?? now()->toDateString(),
                'status' => $validated['status'] ?? 'active',
            ]);

            return $user->load('studentProfile');
        });

        return (new StudentResource($student))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified student.
     */
    public function show(User $student): StudentResource
    {
        if ($student->role !== 'student') {
            abort(404, 'الطالب غير موجود');
        }

        $student->load('studentProfile', 'studentProfile.parent');

        return new StudentResource($student);
    }

    /**
     * Update the specified student.
     */
    public function update(UpdateStudentRequest $request, User $student): StudentResource
    {
        if ($student->role !== 'student') {
            abort(404, 'الطالب غير موجود');
        }

        $validated = $request->validated();

        DB::transaction(function () use ($student, $validated) {
            $userFields = ['name', 'email', 'phone', 'date_of_birth', 'gender', 'is_active'];
            $userUpdates = array_filter(
                array_intersect_key($validated, array_flip($userFields)),
                fn($value) => $value !== null
            );

            if (!empty($validated['password'])) {
                $userUpdates['password'] = Hash::make($validated['password']);
            }

            if (!empty($userUpdates)) {
                $student->update($userUpdates);
            }

            $profileFields = [
                'parent_id', 'grade_level', 'school_name', 'address',
                'emergency_contact_name', 'emergency_contact_phone',
                'notes', 'enrollment_date', 'status'
            ];
            $profileUpdates = array_intersect_key($validated, array_flip($profileFields));

            if (!empty($profileUpdates)) {
                $student->studentProfile()->updateOrCreate(
                    ['user_id' => $student->id],
                    $profileUpdates
                );
            }
        });

        $student->load('studentProfile', 'studentProfile.parent');

        return new StudentResource($student);
    }

    /**
     * Remove the specified student.
     */
    public function destroy(User $student): JsonResponse
    {
        // Only teachers and admins can delete students
        $user = auth()->user();
        if (!$user || !in_array($user->role, ['teacher', 'admin'])) {
            abort(403, 'غير مصرح لك بحذف الطلاب');
        }

        if ($student->role !== 'student') {
            abort(404, 'الطالب غير موجود');
        }

        $student->delete();

        return response()->json([
            'message' => 'تم حذف الطالب بنجاح',
        ]);
    }

    /**
     * Get the attendance records for the specified student.
     */
    public function attendance(User $student, Request $request): JsonResponse
    {
        if ($student->role !== 'student') {
            abort(404, 'الطالب غير موجود');
        }

        $query = $student->attendances()
            ->with('session')
            ->when($request->from, function ($q, $from) {
                $q->whereDate('created_at', '>=', $from);
            })
            ->when($request->to, function ($q, $to) {
                $q->whereDate('created_at', '<=', $to);
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->orderBy('created_at', 'desc');

        $perPage = min($request->per_page ?? 15, 100);
        $attendances = $query->paginate($perPage);

        return response()->json([
            'data' => $attendances->items(),
            'meta' => [
                'current_page' => $attendances->currentPage(),
                'last_page' => $attendances->lastPage(),
                'per_page' => $attendances->perPage(),
                'total' => $attendances->total(),
            ],
            'summary' => [
                'total' => $student->attendances()->count(),
                'present' => $student->attendances()->where('status', 'present')->count(),
                'absent' => $student->attendances()->where('status', 'absent')->count(),
                'late' => $student->attendances()->where('status', 'late')->count(),
                'excused' => $student->attendances()->where('status', 'excused')->count(),
            ],
        ]);
    }

    /**
     * Get the payment records for the specified student.
     */
    public function payments(User $student, Request $request): JsonResponse
    {
        if ($student->role !== 'student') {
            abort(404, 'الطالب غير موجود');
        }

        $query = $student->payments()
            ->when($request->from, function ($q, $from) {
                $q->whereDate('created_at', '>=', $from);
            })
            ->when($request->to, function ($q, $to) {
                $q->whereDate('created_at', '<=', $to);
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->orderBy('created_at', 'desc');

        $perPage = min($request->per_page ?? 15, 100);
        $payments = $query->paginate($perPage);

        return response()->json([
            'data' => $payments->items(),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ],
            'summary' => [
                'total_paid' => $student->payments()->where('status', 'paid')->sum('amount'),
                'total_pending' => $student->payments()->where('status', 'pending')->sum('amount'),
                'total_overdue' => $student->payments()->where('status', 'overdue')->sum('amount'),
            ],
        ]);
    }

    /**
     * Get the grades/exam results for the specified student.
     */
    public function grades(User $student, Request $request): JsonResponse
    {
        if ($student->role !== 'student') {
            abort(404, 'الطالب غير موجود');
        }

        $query = $student->examResults()
            ->with('exam')
            ->when($request->from, function ($q, $from) {
                $q->whereDate('created_at', '>=', $from);
            })
            ->when($request->to, function ($q, $to) {
                $q->whereDate('created_at', '<=', $to);
            })
            ->orderBy('created_at', 'desc');

        $perPage = min($request->per_page ?? 15, 100);
        $grades = $query->paginate($perPage);

        $allResults = $student->examResults;
        $averageScore = $allResults->count() > 0
            ? round($allResults->avg('score'), 2)
            : 0;

        return response()->json([
            'data' => $grades->items(),
            'meta' => [
                'current_page' => $grades->currentPage(),
                'last_page' => $grades->lastPage(),
                'per_page' => $grades->perPage(),
                'total' => $grades->total(),
            ],
            'summary' => [
                'total_exams' => $allResults->count(),
                'average_score' => $averageScore,
                'highest_score' => $allResults->max('score') ?? 0,
                'lowest_score' => $allResults->min('score') ?? 0,
            ],
        ]);
    }
}
