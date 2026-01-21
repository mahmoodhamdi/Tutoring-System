<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Announcement\StoreAnnouncementRequest;
use App\Http\Requests\Announcement\UpdateAnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of announcements.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Announcement::with(['author', 'group']);

        // Filter by group
        if ($request->has('group_id')) {
            $query->forGroup($request->group_id);
        }

        // Filter by published status
        if ($request->has('is_published')) {
            if ($request->boolean('is_published')) {
                $query->published();
            } else {
                $query->where('is_published', false);
            }
        }

        // Filter by active only (published and not expired)
        if ($request->boolean('active_only')) {
            $query->active();
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->byPriority($request->priority);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->byType($request->type);
        }

        // Filter by pinned
        if ($request->has('is_pinned')) {
            $query->where('is_pinned', $request->boolean('is_pinned'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Order: pinned first, then by priority and date
        // Using CASE for SQLite compatibility
        $query->orderByDesc('is_pinned')
            ->orderByRaw("CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 WHEN 'low' THEN 4 ELSE 5 END")
            ->orderByDesc('published_at');

        $announcements = $query->paginate($request->get('per_page', 15));

        return AnnouncementResource::collection($announcements);
    }

    /**
     * Get recent announcements for dashboard.
     */
    public function recent(Request $request): AnonymousResourceCollection
    {
        $limit = $request->get('limit', 5);

        $announcements = Announcement::with(['author', 'group'])
            ->active()
            ->orderByDesc('is_pinned')
            ->orderByRaw("CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 WHEN 'low' THEN 4 ELSE 5 END")
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get();

        return AnnouncementResource::collection($announcements);
    }

    /**
     * Get unread announcements for user.
     */
    public function unread(Request $request): AnonymousResourceCollection
    {
        $user = auth()->user();

        $announcements = Announcement::with(['author', 'group'])
            ->active()
            ->unreadBy($user->id)
            ->orderByDesc('is_pinned')
            ->orderByRaw("CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 WHEN 'low' THEN 4 ELSE 5 END")
            ->orderByDesc('published_at')
            ->get();

        return AnnouncementResource::collection($announcements);
    }

    /**
     * Store a newly created announcement.
     */
    public function store(StoreAnnouncementRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $announcement = Announcement::create($data);

        // Auto-publish if requested
        if ($request->boolean('publish')) {
            $announcement->publish();
        }

        return response()->json([
            'message' => 'تم إنشاء الإعلان بنجاح',
            'data' => new AnnouncementResource($announcement->load(['author', 'group'])),
        ], 201);
    }

    /**
     * Display the specified announcement.
     */
    public function show(Announcement $announcement): AnnouncementResource
    {
        return new AnnouncementResource($announcement->load(['author', 'group', 'readBy']));
    }

    /**
     * Update the specified announcement.
     */
    public function update(UpdateAnnouncementRequest $request, Announcement $announcement): JsonResponse
    {
        $announcement->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث الإعلان بنجاح',
            'data' => new AnnouncementResource($announcement->load(['author', 'group'])),
        ]);
    }

    /**
     * Remove the specified announcement.
     */
    public function destroy(Announcement $announcement): JsonResponse
    {
        $announcement->delete();

        return response()->json([
            'message' => 'تم حذف الإعلان بنجاح',
        ]);
    }

    /**
     * Publish announcement.
     */
    public function publish(Announcement $announcement): JsonResponse
    {
        $announcement->publish();

        return response()->json([
            'message' => 'تم نشر الإعلان بنجاح',
            'data' => new AnnouncementResource($announcement->load(['author', 'group'])),
        ]);
    }

    /**
     * Unpublish announcement.
     */
    public function unpublish(Announcement $announcement): JsonResponse
    {
        $announcement->unpublish();

        return response()->json([
            'message' => 'تم إلغاء نشر الإعلان بنجاح',
            'data' => new AnnouncementResource($announcement->load(['author', 'group'])),
        ]);
    }

    /**
     * Pin announcement.
     */
    public function pin(Announcement $announcement): JsonResponse
    {
        $announcement->pin();

        return response()->json([
            'message' => 'تم تثبيت الإعلان بنجاح',
            'data' => new AnnouncementResource($announcement->load(['author', 'group'])),
        ]);
    }

    /**
     * Unpin announcement.
     */
    public function unpin(Announcement $announcement): JsonResponse
    {
        $announcement->unpin();

        return response()->json([
            'message' => 'تم إلغاء تثبيت الإعلان بنجاح',
            'data' => new AnnouncementResource($announcement->load(['author', 'group'])),
        ]);
    }

    /**
     * Mark announcement as read for current user.
     */
    public function markAsRead(Announcement $announcement): JsonResponse
    {
        $announcement->markAsRead(auth()->id());

        return response()->json([
            'message' => 'تم تحديد الإعلان كمقروء',
        ]);
    }

    /**
     * Mark all announcements as read for current user.
     */
    public function markAllAsRead(): JsonResponse
    {
        $user = auth()->user();

        $unreadAnnouncements = Announcement::active()
            ->unreadBy($user->id)
            ->get();

        foreach ($unreadAnnouncements as $announcement) {
            $announcement->markAsRead($user->id);
        }

        return response()->json([
            'message' => 'تم تحديد جميع الإعلانات كمقروءة',
            'count' => $unreadAnnouncements->count(),
        ]);
    }

    /**
     * Get announcement statistics.
     */
    public function statistics(): JsonResponse
    {
        $total = Announcement::count();
        $published = Announcement::published()->count();
        $active = Announcement::active()->count();
        $pinned = Announcement::pinned()->published()->count();

        $byType = Announcement::published()
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type');

        $byPriority = Announcement::published()
            ->selectRaw('priority, COUNT(*) as count')
            ->groupBy('priority')
            ->pluck('count', 'priority');

        return response()->json([
            'data' => [
                'total' => $total,
                'published' => $published,
                'active' => $active,
                'pinned' => $pinned,
                'drafts' => $total - $published,
                'by_type' => $byType,
                'by_priority' => $byPriority,
            ],
        ]);
    }
}
