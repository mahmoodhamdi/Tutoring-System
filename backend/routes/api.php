<?php

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

// Auth routes will be added in Phase 2
Route::prefix('auth')->group(function () {
    // POST /api/auth/register
    // POST /api/auth/login
    // POST /api/auth/logout
    // POST /api/auth/refresh
    // GET /api/auth/me
    // PUT /api/auth/profile
    // POST /api/auth/change-password
    // POST /api/auth/forgot-password
    // POST /api/auth/reset-password
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Get authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Students routes (Phase 3)
    Route::prefix('students')->group(function () {
        // GET /api/students
        // GET /api/students/{id}
        // POST /api/students
        // PUT /api/students/{id}
        // DELETE /api/students/{id}
        // GET /api/students/{id}/attendance
        // GET /api/students/{id}/payments
        // GET /api/students/{id}/grades
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
