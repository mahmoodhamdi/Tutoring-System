<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Group\AddStudentsRequest;
use App\Http\Requests\Group\StoreGroupRequest;
use App\Http\Requests\Group\UpdateGroupRequest;
use App\Http\Resources\GroupResource;
use App\Http\Resources\StudentResource;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GroupController extends Controller
{
    /**
     * Display a listing of groups.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Group::query()
            ->withCount(['activeStudents as student_count'])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('subject', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->subject, function ($q, $subject) {
                $q->where('subject', $subject);
            })
            ->when($request->grade_level, function ($q, $gradeLevel) {
                $q->where('grade_level', $gradeLevel);
            })
            ->when($request->is_active !== null, function ($q) use ($request) {
                $q->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
            })
            ->when($request->has_available_spots, function ($q) {
                $q->withAvailableSpots();
            });

        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = min($request->per_page ?? 15, 100);
        $groups = $query->paginate($perPage);

        return GroupResource::collection($groups);
    }

    /**
     * Store a newly created group.
     */
    public function store(StoreGroupRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $group = Group::create($validated);
        $group->loadCount(['activeStudents as student_count']);

        return (new GroupResource($group))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified group.
     */
    public function show(Group $group): GroupResource
    {
        $group->loadCount(['activeStudents as student_count']);
        $group->load(['activeStudents.studentProfile']);

        return new GroupResource($group);
    }

    /**
     * Update the specified group.
     */
    public function update(UpdateGroupRequest $request, Group $group): GroupResource
    {
        $validated = $request->validated();

        $group->update($validated);
        $group->loadCount(['activeStudents as student_count']);

        return new GroupResource($group);
    }

    /**
     * Remove the specified group.
     */
    public function destroy(Group $group): JsonResponse
    {
        // Only teachers can delete groups
        if (!auth()->user()->isTeacher()) {
            return response()->json([
                'message' => 'غير مصرح لك بحذف المجموعات',
            ], 403);
        }

        // Check if group has active students
        if ($group->activeStudents()->exists()) {
            return response()->json([
                'message' => 'لا يمكن حذف المجموعة لأنها تحتوي على طلاب نشطين',
            ], 422);
        }

        $group->delete();

        return response()->json([
            'message' => 'تم حذف المجموعة بنجاح',
        ]);
    }

    /**
     * Add students to the group.
     */
    public function addStudents(AddStudentsRequest $request, Group $group): JsonResponse
    {
        $validated = $request->validated();
        $studentIds = $validated['student_ids'];
        $joinedAt = $validated['joined_at'] ?? now()->toDateString();

        // Check if group has enough spots
        $currentCount = $group->activeStudents()->count();
        $newCount = count($studentIds);
        $availableSpots = $group->max_students - $currentCount;

        if ($newCount > $availableSpots) {
            return response()->json([
                'message' => 'لا توجد أماكن كافية في المجموعة',
                'available_spots' => $availableSpots,
            ], 422);
        }

        // Filter out students already in group
        $existingStudentIds = $group->students()->pluck('users.id')->toArray();
        $newStudentIds = array_diff($studentIds, $existingStudentIds);

        if (empty($newStudentIds)) {
            return response()->json([
                'message' => 'جميع الطلاب المحددين موجودون بالفعل في المجموعة',
            ], 422);
        }

        // Add new students
        $pivotData = [];
        foreach ($newStudentIds as $studentId) {
            $pivotData[$studentId] = [
                'joined_at' => $joinedAt,
                'is_active' => true,
            ];
        }

        $group->students()->attach($pivotData);

        $group->loadCount(['activeStudents as student_count']);

        return response()->json([
            'message' => 'تمت إضافة الطلاب بنجاح',
            'added_count' => count($newStudentIds),
            'student_count' => $group->student_count,
        ]);
    }

    /**
     * Remove a student from the group.
     */
    public function removeStudent(Group $group, User $student): JsonResponse
    {
        // Only teachers can remove students
        if (!auth()->user()->isTeacher()) {
            return response()->json([
                'message' => 'غير مصرح لك بإزالة الطلاب',
            ], 403);
        }

        if ($student->role !== 'student') {
            return response()->json([
                'message' => 'المستخدم المحدد ليس طالباً',
            ], 422);
        }

        // Check if student is an active member of the group
        $isActiveMember = $group->students()
            ->where('users.id', $student->id)
            ->wherePivot('is_active', true)
            ->exists();

        if (!$isActiveMember) {
            return response()->json([
                'message' => 'الطالب غير موجود في هذه المجموعة',
            ], 404);
        }

        // Soft remove - set left_at and is_active = false
        $group->students()->updateExistingPivot($student->id, [
            'left_at' => now()->toDateString(),
            'is_active' => false,
        ]);

        $group->loadCount(['activeStudents as student_count']);

        return response()->json([
            'message' => 'تمت إزالة الطالب من المجموعة بنجاح',
            'student_count' => $group->student_count,
        ]);
    }

    /**
     * Get students in the group.
     */
    public function students(Group $group, Request $request): AnonymousResourceCollection
    {
        $query = $group->students()
            ->with('studentProfile');

        // Handle include_inactive parameter
        $includeInactive = filter_var($request->include_inactive, FILTER_VALIDATE_BOOLEAN);

        if (!$includeInactive) {
            // By default, only show active students unless include_inactive=true
            if ($request->is_active !== null) {
                $active = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
                $query->wherePivot('is_active', $active);
            } else {
                $query->wherePivot('is_active', true);
            }
        }

        $query
            ->when($request->search, function ($q, $search) {
                $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            });

        $sortBy = $request->sort_by ?? 'pivot_joined_at';
        $sortOrder = $request->sort_order ?? 'desc';

        if (str_starts_with($sortBy, 'pivot_')) {
            $query->orderByPivot(str_replace('pivot_', '', $sortBy), $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $perPage = min($request->per_page ?? 15, 100);
        $students = $query->paginate($perPage);

        return StudentResource::collection($students);
    }

    /**
     * Get sessions for the group.
     */
    public function sessions(Group $group, Request $request): JsonResponse
    {
        $query = $group->sessions()
            ->when($request->from, function ($q, $from) {
                $q->whereDate('scheduled_at', '>=', $from);
            })
            ->when($request->to, function ($q, $to) {
                $q->whereDate('scheduled_at', '<=', $to);
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->orderBy('scheduled_at', 'desc');

        $perPage = min($request->per_page ?? 15, 100);
        $sessions = $query->paginate($perPage);

        return response()->json([
            'data' => $sessions->items(),
            'meta' => [
                'current_page' => $sessions->currentPage(),
                'last_page' => $sessions->lastPage(),
                'per_page' => $sessions->perPage(),
                'total' => $sessions->total(),
            ],
        ]);
    }
}
