<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Tutoring System API',
    description: 'REST API for Private Tutoring Management System. Manage students, groups, sessions, attendance, payments, quizzes, and announcements.',
    contact: new OA\Contact(email: 'support@tutoring-system.com', name: 'API Support'),
    license: new OA\License(name: 'MIT', url: 'https://opensource.org/licenses/MIT')
)]
#[OA\Server(url: 'http://localhost:8001/api', description: 'Local Development Server')]
#[OA\Server(url: 'https://api.tutoring-system.com/api', description: 'Production Server')]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Enter your Sanctum token'
)]
#[OA\Tag(name: 'Auth', description: 'Authentication endpoints')]
#[OA\Tag(name: 'Students', description: 'Student management endpoints')]
#[OA\Tag(name: 'Groups', description: 'Group management endpoints')]
#[OA\Tag(name: 'Sessions', description: 'Session scheduling endpoints')]
#[OA\Tag(name: 'Attendance', description: 'Attendance tracking endpoints')]
#[OA\Tag(name: 'Payments', description: 'Payment management endpoints')]
#[OA\Tag(name: 'Quizzes', description: 'Quiz management endpoints')]
#[OA\Tag(name: 'Exams', description: 'Exam management endpoints')]
#[OA\Tag(name: 'Announcements', description: 'Announcement management endpoints')]
#[OA\Tag(name: 'Notifications', description: 'Notification endpoints')]
#[OA\Tag(name: 'Dashboard', description: 'Dashboard statistics endpoints')]
#[OA\Tag(name: 'Reports', description: 'Report generation endpoints')]
#[OA\Tag(name: 'Settings', description: 'System settings endpoints')]
#[OA\Tag(name: 'Portal', description: 'Student/Parent portal endpoints')]
#[OA\Tag(name: 'Health', description: 'Health check endpoints')]
abstract class Controller
{
    use AuthorizesRequests;
}
