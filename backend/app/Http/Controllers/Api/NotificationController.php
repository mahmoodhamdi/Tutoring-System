<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NotificationController extends Controller
{
    /**
     * Display a listing of notifications for the authenticated user.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = auth()->user();

        $query = Notification::where('user_id', $user->id);

        // Filter by read status
        if ($request->has('is_read')) {
            if ($request->boolean('is_read')) {
                $query->read();
            } else {
                $query->unread();
            }
        }

        // Filter by type
        if ($request->has('type')) {
            $query->ofType($request->type);
        }

        // Filter by date range
        if ($request->has('days')) {
            $query->recent((int) $request->days);
        }

        $notifications = $query
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 20));

        return NotificationResource::collection($notifications);
    }

    /**
     * Get unread notifications count.
     */
    public function unreadCount(): JsonResponse
    {
        $user = auth()->user();

        $count = Notification::where('user_id', $user->id)
            ->unread()
            ->count();

        return response()->json([
            'data' => [
                'count' => $count,
            ],
        ]);
    }

    /**
     * Get recent notifications for header dropdown.
     */
    public function recent(Request $request): AnonymousResourceCollection
    {
        $user = auth()->user();
        $limit = $request->get('limit', 5);

        $notifications = Notification::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        return NotificationResource::collection($notifications);
    }

    /**
     * Display the specified notification.
     */
    public function show(Notification $notification): JsonResponse
    {
        $this->authorize('view', $notification);

        return response()->json([
            'data' => new NotificationResource($notification),
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        $this->authorize('update', $notification);

        $notification->markAsRead();

        return response()->json([
            'message' => 'تم تحديد الإشعار كمقروء',
            'data' => new NotificationResource($notification),
        ]);
    }

    /**
     * Mark a notification as unread.
     */
    public function markAsUnread(Notification $notification): JsonResponse
    {
        $this->authorize('update', $notification);

        $notification->markAsUnread();

        return response()->json([
            'message' => 'تم تحديد الإشعار كغير مقروء',
            'data' => new NotificationResource($notification),
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): JsonResponse
    {
        $user = auth()->user();

        $count = Notification::where('user_id', $user->id)
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'تم تحديد جميع الإشعارات كمقروءة',
            'count' => $count,
        ]);
    }

    /**
     * Delete a notification.
     */
    public function destroy(Notification $notification): JsonResponse
    {
        $this->authorize('delete', $notification);

        $notification->delete();

        return response()->json([
            'message' => 'تم حذف الإشعار بنجاح',
        ]);
    }

    /**
     * Delete all read notifications.
     */
    public function deleteRead(): JsonResponse
    {
        $user = auth()->user();

        $count = Notification::where('user_id', $user->id)
            ->read()
            ->delete();

        return response()->json([
            'message' => 'تم حذف الإشعارات المقروءة',
            'count' => $count,
        ]);
    }

    /**
     * Get notification preferences.
     */
    public function preferences(): JsonResponse
    {
        $user = auth()->user();

        // Default preferences (can be stored in user settings later)
        $preferences = [
            'session_reminder' => true,
            'payment_due' => true,
            'exam_reminder' => true,
            'quiz_available' => true,
            'announcement' => true,
            'email_notifications' => false,
            'push_notifications' => true,
        ];

        return response()->json([
            'data' => $preferences,
        ]);
    }

    /**
     * Update notification preferences.
     */
    public function updatePreferences(Request $request): JsonResponse
    {
        $request->validate([
            'session_reminder' => 'boolean',
            'payment_due' => 'boolean',
            'exam_reminder' => 'boolean',
            'quiz_available' => 'boolean',
            'announcement' => 'boolean',
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
        ]);

        // Store preferences (can be implemented with user settings)
        // For now, just return success

        return response()->json([
            'message' => 'تم تحديث تفضيلات الإشعارات',
            'data' => $request->all(),
        ]);
    }

    /**
     * Send a test notification.
     */
    public function sendTest(): JsonResponse
    {
        $user = auth()->user();

        $notification = Notification::createGeneral(
            $user,
            'إشعار تجريبي',
            'هذا إشعار تجريبي للتأكد من عمل نظام الإشعارات',
            ['test' => true]
        );

        return response()->json([
            'message' => 'تم إرسال الإشعار التجريبي',
            'data' => new NotificationResource($notification),
        ]);
    }
}
