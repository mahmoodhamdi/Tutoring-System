# Phase 5: Sessions & Schedule - Implementation Plan

## Overview
Implement session management and scheduling system for tutoring sessions.

## Database Schema

### sessions table
```sql
- id: bigint (PK)
- group_id: bigint (FK to groups)
- title: varchar(255)
- description: text (nullable)
- scheduled_at: datetime
- duration_minutes: int (default 60)
- status: enum('scheduled', 'completed', 'cancelled')
- location: varchar(255) (nullable)
- notes: text (nullable)
- cancelled_at: datetime (nullable)
- cancellation_reason: text (nullable)
- created_at: timestamp
- updated_at: timestamp
```

## API Endpoints

### Sessions CRUD
- `GET /api/sessions` - List sessions with filters (date range, group, status)
- `GET /api/sessions/today` - Get today's sessions
- `GET /api/sessions/week` - Get this week's sessions
- `GET /api/sessions/upcoming` - Get upcoming sessions
- `GET /api/sessions/{id}` - Get session details
- `POST /api/sessions` - Create session
- `PUT /api/sessions/{id}` - Update session
- `DELETE /api/sessions/{id}` - Delete session
- `POST /api/sessions/{id}/cancel` - Cancel session with reason
- `POST /api/sessions/{id}/complete` - Mark session as completed

## Frontend Components
- SessionsCalendar - Calendar view of sessions
- SessionsList - List view of sessions
- SessionCard - Session display card
- SessionForm - Create/edit session form
- SessionDetails - Session detail view
- TodaysSessions - Widget for dashboard

## Implementation Steps
1. Create Session model and migration
2. Create SessionController with all endpoints
3. Create request validation classes
4. Create SessionResource
5. Write backend tests
6. Create frontend types and API
7. Create frontend components and pages
8. Write frontend tests
