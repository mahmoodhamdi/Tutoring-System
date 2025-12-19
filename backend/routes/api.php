<?php

use App\Http\Controllers\Api\AuthController;
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
        // Routes will be added in Phase 4
    });

    // Sessions routes (Phase 5)
    Route::prefix('sessions')->group(function () {
        // Routes will be added in Phase 5
    });

    // Attendance routes (Phase 6)
    Route::prefix('attendance')->group(function () {
        // Routes will be added in Phase 6
    });

    // Payments routes (Phase 7)
    Route::prefix('payments')->group(function () {
        // Routes will be added in Phase 7
    });

    // Exams routes (Phase 8)
    Route::prefix('exams')->group(function () {
        // Routes will be added in Phase 8
    });

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
