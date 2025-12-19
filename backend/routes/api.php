<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\PaymentController;
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
        // Routes will be added in Phase 9
    });

    // Announcements routes (Phase 10)
    Route::prefix('announcements')->group(function () {
        // Routes will be added in Phase 10
    });

    // Notifications routes (Phase 11)
    Route::prefix('notifications')->group(function () {
        // Routes will be added in Phase 11
    });

    // Dashboard routes (Phase 12)
    Route::prefix('dashboard')->group(function () {
        // Routes will be added in Phase 12
    });

    // Reports routes (Phase 12)
    Route::prefix('reports')->group(function () {
        // Routes will be added in Phase 12
    });

    // Settings routes (Phase 14)
    Route::prefix('settings')->group(function () {
        // Routes will be added in Phase 14
    });
});

// Portal routes (Phase 13) - Separate auth for students/parents
Route::prefix('portal')->middleware('auth:sanctum')->group(function () {
    // Routes will be added in Phase 13
});
