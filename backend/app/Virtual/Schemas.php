<?php

namespace App\Virtual;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'User',
    type: 'object',
    required: ['id', 'name', 'phone', 'role'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Ahmed Mohamed'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'ahmed@example.com'),
        new OA\Property(property: 'phone', type: 'string', example: '01000000001'),
        new OA\Property(property: 'role', type: 'string', enum: ['admin', 'teacher', 'student', 'parent'], example: 'teacher'),
        new OA\Property(property: 'is_active', type: 'boolean', example: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ]
)]
#[OA\Schema(
    schema: 'Student',
    type: 'object',
    required: ['id', 'name', 'phone'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Ali Hassan'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'ali@example.com'),
        new OA\Property(property: 'phone', type: 'string', example: '01100000001'),
        new OA\Property(property: 'is_active', type: 'boolean', example: true),
        new OA\Property(property: 'groups_count', type: 'integer', example: 2),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ]
)]
#[OA\Schema(
    schema: 'Group',
    type: 'object',
    required: ['id', 'name'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Math Grade 10'),
        new OA\Property(property: 'subject', type: 'string', example: 'Mathematics'),
        new OA\Property(property: 'grade_level', type: 'string', example: 'Grade 10'),
        new OA\Property(property: 'description', type: 'string', example: 'Advanced math class'),
        new OA\Property(property: 'max_students', type: 'integer', example: 20),
        new OA\Property(property: 'monthly_fee', type: 'number', format: 'float', example: 500.00),
        new OA\Property(property: 'is_active', type: 'boolean', example: true),
        new OA\Property(property: 'students_count', type: 'integer', example: 15),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ]
)]
#[OA\Schema(
    schema: 'Session',
    type: 'object',
    required: ['id', 'group_id', 'session_date'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'group_id', type: 'integer', example: 1),
        new OA\Property(property: 'session_date', type: 'string', format: 'date', example: '2025-01-22'),
        new OA\Property(property: 'start_time', type: 'string', format: 'time', example: '10:00:00'),
        new OA\Property(property: 'end_time', type: 'string', format: 'time', example: '11:00:00'),
        new OA\Property(property: 'location', type: 'string', example: 'Room 101'),
        new OA\Property(property: 'topic', type: 'string', example: 'Algebra basics'),
        new OA\Property(property: 'status', type: 'string', enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], example: 'scheduled'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ]
)]
#[OA\Schema(
    schema: 'Payment',
    type: 'object',
    required: ['id', 'student_id', 'amount', 'status'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'student_id', type: 'integer', example: 1),
        new OA\Property(property: 'group_id', type: 'integer', example: 1),
        new OA\Property(property: 'amount', type: 'number', format: 'float', example: 500.00),
        new OA\Property(property: 'status', type: 'string', enum: ['paid', 'pending', 'partial', 'overdue', 'cancelled'], example: 'paid'),
        new OA\Property(property: 'payment_method', type: 'string', example: 'cash'),
        new OA\Property(property: 'payment_date', type: 'string', format: 'date', example: '2025-01-15'),
        new OA\Property(property: 'due_date', type: 'string', format: 'date', example: '2025-01-20'),
        new OA\Property(property: 'description', type: 'string', example: 'January monthly fee'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ]
)]
#[OA\Schema(
    schema: 'Setting',
    type: 'object',
    required: ['id', 'key', 'value', 'type', 'group'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'key', type: 'string', example: 'app_name'),
        new OA\Property(property: 'value', type: 'string', example: 'Tutoring System'),
        new OA\Property(property: 'type', type: 'string', enum: ['string', 'boolean', 'integer', 'json'], example: 'string'),
        new OA\Property(property: 'group', type: 'string', example: 'general'),
        new OA\Property(property: 'label', type: 'string', example: 'Application Name'),
        new OA\Property(property: 'description', type: 'string', example: 'The name of the application'),
        new OA\Property(property: 'is_public', type: 'boolean', example: true),
    ]
)]
#[OA\Schema(
    schema: 'Announcement',
    type: 'object',
    required: ['id', 'title', 'content'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'title', type: 'string', example: 'Holiday Notice'),
        new OA\Property(property: 'content', type: 'string', example: 'Classes will be suspended during Eid holidays'),
        new OA\Property(property: 'type', type: 'string', enum: ['info', 'warning', 'success', 'danger'], example: 'info'),
        new OA\Property(property: 'priority', type: 'string', enum: ['low', 'medium', 'high'], example: 'medium'),
        new OA\Property(property: 'is_published', type: 'boolean', example: true),
        new OA\Property(property: 'is_pinned', type: 'boolean', example: false),
        new OA\Property(property: 'published_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'expires_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ]
)]
#[OA\Schema(
    schema: 'PaginationMeta',
    type: 'object',
    properties: [
        new OA\Property(property: 'current_page', type: 'integer', example: 1),
        new OA\Property(property: 'from', type: 'integer', example: 1),
        new OA\Property(property: 'last_page', type: 'integer', example: 5),
        new OA\Property(property: 'per_page', type: 'integer', example: 15),
        new OA\Property(property: 'to', type: 'integer', example: 15),
        new OA\Property(property: 'total', type: 'integer', example: 75),
    ]
)]
#[OA\Schema(
    schema: 'ErrorResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'The given data was invalid.'),
        new OA\Property(property: 'errors', type: 'object'),
    ]
)]
class Schemas
{
    // This class is used only for OpenAPI schema definitions
}
