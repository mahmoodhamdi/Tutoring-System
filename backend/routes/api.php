<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\PortalController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Auth routes - Public
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Auth routes - Protected
Route::prefix('auth')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Get authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Students routes (Phase 3)
    Route::prefix('students')->group(function () {
        Route::get('/', [StudentController::class, 'index']);
        Route::post('/', [StudentController::class, 'store']);
        Route::get('/{student}', [StudentController::class, 'show']);
        Route::put('/{student}', [StudentController::class, 'update']);
        Route::delete('/{student}', [StudentController::class, 'destroy']);
        Route::get('/{student}/attendance', [StudentController::class, 'attendance']);
        Route::get('/{student}/payments', [StudentController::class, 'payments']);
        Route::get('/{student}/grades', [StudentController::class, 'grades']);
    });

    // Groups routes (Phase 4)
    Route::prefix('groups')->group(function () {
        Route::get('/', [GroupController::class, 'index']);
        Route::post('/', [GroupController::class, 'store']);
        Route::get('/{group}', [GroupController::class, 'show']);
        Route::put('/{group}', [GroupController::class, 'update']);
        Route::delete('/{group}', [GroupController::class, 'destroy']);
        Route::post('/{group}/students', [GroupController::class, 'addStudents']);
        Route::delete('/{group}/students/{student}', [GroupController::class, 'removeStudent']);
        Route::get('/{group}/students', [GroupController::class, 'students']);
        Route::get('/{group}/sessions', [GroupController::class, 'sessions']);
    });

    // Sessions routes (Phase 5)
    Route::prefix('sessions')->group(function () {
        Route::get('/', [SessionController::class, 'index']);
        Route::get('/today', [SessionController::class, 'today']);
        Route::get('/week', [SessionController::class, 'week']);
        Route::get('/upcoming', [SessionController::class, 'upcoming']);
        Route::post('/', [SessionController::class, 'store']);
        Route::get('/{session}', [SessionController::class, 'show']);
        Route::put('/{session}', [SessionController::class, 'update']);
        Route::delete('/{session}', [SessionController::class, 'destroy']);
        Route::post('/{session}/cancel', [SessionController::class, 'cancel']);
        Route::post('/{session}/complete', [SessionController::class, 'complete']);
        Route::get('/{session}/attendance', [AttendanceController::class, 'sessionAttendance']);
        Route::post('/{session}/attendance', [AttendanceController::class, 'recordAttendance']);
    });

    // Attendance routes (Phase 6)
    Route::prefix('attendance')->group(function () {
        Route::get('/', [AttendanceController::class, 'index']);
        Route::get('/report', [AttendanceController::class, 'report']);
        Route::put('/{attendance}', [AttendanceController::class, 'update']);
    });

    // Payments routes (Phase 7)
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::get('/pending', [PaymentController::class, 'pending']);
        Route::get('/overdue', [PaymentController::class, 'overdue']);
        Route::get('/report', [PaymentController::class, 'report']);
        Route::post('/', [PaymentController::class, 'store']);
        Route::get('/{payment}', [PaymentController::class, 'show']);
        Route::put('/{payment}', [PaymentController::class, 'update']);
        Route::delete('/{payment}', [PaymentController::class, 'destroy']);
    });

    // Exams routes (Phase 8)
    Route::prefix('exams')->group(function () {
        Route::get('/', [ExamController::class, 'index']);
        Route::get('/upcoming', [ExamController::class, 'upcoming']);
        Route::get('/recent', [ExamController::class, 'recent']);
        Route::post('/', [ExamController::class, 'store']);
        Route::get('/{exam}', [ExamController::class, 'show']);
        Route::put('/{exam}', [ExamController::class, 'update']);
        Route::delete('/{exam}', [ExamController::class, 'destroy']);
        Route::post('/{exam}/publish', [ExamController::class, 'publish']);
        Route::post('/{exam}/cancel', [ExamController::class, 'cancel']);
        Route::get('/{exam}/results', [ExamController::class, 'results']);
        Route::post('/{exam}/results', [ExamController::class, 'recordResults']);
        Route::put('/{exam}/results/{student}', [ExamController::class, 'updateResult']);
        Route::get('/{exam}/statistics', [ExamController::class, 'statistics']);
    });

    // Student Exams History
    Route::get('/students/{student}/exams', [ExamController::class, 'studentExams']);

    // Quizzes routes (Phase 9)
    Route::prefix('quizzes')->group(function () {
        Route::get('/', [QuizController::class, 'index']);
        Route::post('/', [QuizController::class, 'store']);
        Route::get('/{quiz}', [QuizController::class, 'show']);
        Route::put('/{quiz}', [QuizController::class, 'update']);
        Route::delete('/{quiz}', [QuizController::class, 'destroy']);

        // Publishing
        Route::post('/{quiz}/publish', [QuizController::class, 'publish']);
        Route::post('/{quiz}/unpublish', [QuizController::class, 'unpublish']);
        Route::post('/{quiz}/duplicate', [QuizController::class, 'duplicate']);

        // Questions management
        Route::post('/{quiz}/questions', [QuizController::class, 'addQuestion']);
        Route::put('/{quiz}/questions/{question}', [QuizController::class, 'updateQuestion']);
        Route::delete('/{quiz}/questions/{question}', [QuizController::class, 'deleteQuestion']);
        Route::post('/{quiz}/questions/reorder', [QuizController::class, 'reorderQuestions']);

        // Quiz taking (student)
        Route::post('/{quiz}/start', [QuizController::class, 'startAttempt'])->name('quizzes.start-attempt');
        Route::post('/{quiz}/attempts/{attempt}/submit', [QuizController::class, 'submitAttempt']);
        Route::get('/{quiz}/my-attempts', [QuizController::class, 'studentAttempts'])->name('quizzes.student-attempts');

        // Attempts management (teacher)
        Route::get('/{quiz}/attempts', [QuizController::class, 'allAttempts']);
        Route::get('/{quiz}/attempts/{attempt}', [QuizController::class, 'showAttempt']);
        Route::post('/{quiz}/attempts/{attempt}/answers/{answer}/grade', [QuizController::class, 'gradeAnswer']);
    });

    // Announcements routes (Phase 10)
    Route::prefix('announcements')->group(function () {
        Route::get('/', [AnnouncementController::class, 'index']);
        Route::get('/recent', [AnnouncementController::class, 'recent']);
        Route::get('/unread', [AnnouncementController::class, 'unread']);
        Route::get('/statistics', [AnnouncementController::class, 'statistics']);
        Route::post('/', [AnnouncementController::class, 'store']);
        Route::get('/{announcement}', [AnnouncementController::class, 'show']);
        Route::put('/{announcement}', [AnnouncementController::class, 'update']);
        Route::delete('/{announcement}', [AnnouncementController::class, 'destroy']);
        Route::post('/{announcement}/publish', [AnnouncementController::class, 'publish']);
        Route::post('/{announcement}/unpublish', [AnnouncementController::class, 'unpublish']);
        Route::post('/{announcement}/pin', [AnnouncementController::class, 'pin']);
        Route::post('/{announcement}/unpin', [AnnouncementController::class, 'unpin']);
        Route::post('/{announcement}/read', [AnnouncementController::class, 'markAsRead']);
        Route::post('/mark-all-read', [AnnouncementController::class, 'markAllAsRead']);
    });

    // Notifications routes (Phase 11)
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::get('/recent', [NotificationController::class, 'recent']);
        Route::get('/preferences', [NotificationController::class, 'preferences']);
        Route::put('/preferences', [NotificationController::class, 'updatePreferences']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/read', [NotificationController::class, 'deleteRead']);
        Route::post('/test', [NotificationController::class, 'sendTest']);
        Route::get('/{notification}', [NotificationController::class, 'show']);
        Route::post('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/{notification}/unread', [NotificationController::class, 'markAsUnread']);
        Route::delete('/{notification}', [NotificationController::class, 'destroy']);
    });

    // Dashboard routes (Phase 12)
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index']);
        Route::get('/quick-stats', [DashboardController::class, 'quickStats']);
        Route::get('/recent-activities', [DashboardController::class, 'recentActivities']);
    });

    // Reports routes (Phase 13)
    Route::prefix('reports')->group(function () {
        Route::get('/types', [ReportsController::class, 'types']);
        Route::get('/attendance', [ReportsController::class, 'attendance']);
        Route::get('/payments', [ReportsController::class, 'payments']);
        Route::get('/performance', [ReportsController::class, 'performance']);
        Route::get('/students', [ReportsController::class, 'students']);
        Route::get('/sessions', [ReportsController::class, 'sessions']);
        Route::get('/financial-summary', [ReportsController::class, 'financialSummary']);
        Route::get('/export/csv', [ReportsController::class, 'exportCsv']);
    });

    // Settings routes (Phase 14)
    Route::prefix('settings')->group(function () {
        // Routes will be added in Phase 14
    });
});

// Portal routes (Phase 14) - For students/parents
Route::prefix('portal')->group(function () {
    // Public routes
    Route::post('/login', [PortalController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [PortalController::class, 'logout']);
        Route::get('/profile', [PortalController::class, 'profile']);
        Route::post('/password', [PortalController::class, 'updatePassword']);
        Route::get('/dashboard', [PortalController::class, 'dashboard']);
        Route::get('/attendance', [PortalController::class, 'attendance']);
        Route::get('/payments', [PortalController::class, 'payments']);
        Route::get('/grades', [PortalController::class, 'grades']);
        Route::get('/schedule', [PortalController::class, 'schedule']);
        Route::get('/announcements', [PortalController::class, 'announcements']);
        Route::get('/announcements/{announcement}', [PortalController::class, 'showAnnouncement']);
        Route::get('/children', [PortalController::class, 'children']);
    });
});
