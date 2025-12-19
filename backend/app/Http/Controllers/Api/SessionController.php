<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Session\StoreSessionRequest;
use App\Http\Requests\Session\UpdateSessionRequest;
use App\Http\Requests\Session\CancelSessionRequest;
use App\Http\Resources\SessionResource;
use App\Models\Session;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SessionController extends Controller
{
    /**
     * Display a listing of sessions.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Session::with('group')
            ->orderBy('scheduled_at', 'desc');

        // Filter by group
        if ($request->has('group_id')) {
            $query->where('group_id', $request->group_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->betweenDates($request->start_date, $request->end_date);
        } elseif ($request->has('date')) {
            $query->onDate($request->date);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('group', function ($gq) use ($search) {
                        $gq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $perPage = min($request->input('per_page', 15), 100);

        return SessionResource::collection($query->paginate($perPage));
    }

    /**
     * Get today's sessions.
     */
    public function today(): AnonymousResourceCollection
    {
        $sessions = Session::with('group')
            ->today()
            ->orderBy('scheduled_at')
            ->get();

        return SessionResource::collection($sessions);
    }

    /**
     * Get this week's sessions.
     */
    public function week(): AnonymousResourceCollection
    {
        $sessions = Session::with('group')
            ->thisWeek()
            ->orderBy('scheduled_at')
            ->get();

        return SessionResource::collection($sessions);
    }

    /**
     * Get upcoming sessions.
     */
    public function upcoming(Request $request): AnonymousResourceCollection
    {
        $limit = min($request->input('limit', 10), 50);

        $sessions = Session::with('group')
            ->upcoming()
            ->limit($limit)
            ->get();

        return SessionResource::collection($sessions);
    }

    /**
     * Store a newly created session.
     */
    public function store(StoreSessionRequest $request): JsonResponse
    {
        $session = Session::create($request->validated());

        return response()->json([
            'message' => 'تم إنشاء الجلسة بنجاح',
            'data' => new SessionResource($session->load('group')),
        ], 201);
    }

    /**
     * Display the specified session.
     */
    public function show(Session $session): JsonResponse
    {
        return response()->json([
            'data' => new SessionResource($session->load(['group', 'attendances.student'])),
        ]);
    }

    /**
     * Update the specified session.
     */
    public function update(UpdateSessionRequest $request, Session $session): JsonResponse
    {
        // Cannot update cancelled sessions
        if ($session->status === 'cancelled') {
            return response()->json([
                'message' => 'لا يمكن تعديل جلسة ملغاة',
            ], 422);
        }

        $session->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث الجلسة بنجاح',
            'data' => new SessionResource($session->load('group')),
        ]);
    }

    /**
     * Remove the specified session.
     */
    public function destroy(Session $session): JsonResponse
    {
        // Check if session has attendance records
        if ($session->attendances()->exists()) {
            return response()->json([
                'message' => 'لا يمكن حذف جلسة لها سجلات حضور',
            ], 422);
        }

        $session->delete();

        return response()->json([
            'message' => 'تم حذف الجلسة بنجاح',
        ]);
    }

    /**
     * Cancel a session.
     */
    public function cancel(CancelSessionRequest $request, Session $session): JsonResponse
    {
        if ($session->status === 'cancelled') {
            return response()->json([
                'message' => 'الجلسة ملغاة بالفعل',
            ], 422);
        }

        if ($session->status === 'completed') {
            return response()->json([
                'message' => 'لا يمكن إلغاء جلسة مكتملة',
            ], 422);
        }

        $session->cancel($request->reason);

        return response()->json([
            'message' => 'تم إلغاء الجلسة بنجاح',
            'data' => new SessionResource($session->load('group')),
        ]);
    }

    /**
     * Mark a session as completed.
     */
    public function complete(Session $session): JsonResponse
    {
        if ($session->status === 'completed') {
            return response()->json([
                'message' => 'الجلسة مكتملة بالفعل',
            ], 422);
        }

        if ($session->status === 'cancelled') {
            return response()->json([
                'message' => 'لا يمكن إكمال جلسة ملغاة',
            ], 422);
        }

        $session->complete();

        return response()->json([
            'message' => 'تم إكمال الجلسة بنجاح',
            'data' => new SessionResource($session->load('group')),
        ]);
    }
}
