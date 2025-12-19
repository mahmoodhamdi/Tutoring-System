# Phase 6: Attendance System - Implementation Plan

## Overview
Implement attendance tracking for tutoring sessions.

## Database Schema

### attendances table
```sql
- id: bigint (PK)
- session_id: bigint (FK to sessions)
- student_id: bigint (FK to users)
- status: enum('present', 'absent', 'late', 'excused')
- check_in_time: datetime (nullable)
- notes: text (nullable)
- marked_by: bigint (FK to users)
- created_at: timestamp
- updated_at: timestamp
- unique: [session_id, student_id]
```

## API Endpoints

### Attendance Management
- `GET /api/sessions/{id}/attendance` - Get attendance for session
- `POST /api/sessions/{id}/attendance` - Record attendance (bulk)
- `PUT /api/attendance/{id}` - Update single attendance
- `GET /api/students/{id}/attendance` - Get student's attendance history
- `GET /api/groups/{id}/attendance-report` - Get group attendance report
- `GET /api/attendance/report` - Get attendance report with filters

## Frontend Components
- AttendanceForm - Take attendance for session
- AttendanceList - List of attendance records
- AttendanceStatusBadge - Status indicator
- StudentAttendanceHistory - Student's attendance history
- AttendanceStats - Statistics cards
- AttendanceReport - Report view

## Implementation Steps
1. Create Attendance model and migration
2. Create AttendanceController with endpoints
3. Create request validation classes
4. Create AttendanceResource
5. Write backend tests
6. Create frontend types and API
7. Create frontend components and pages
8. Write frontend tests
