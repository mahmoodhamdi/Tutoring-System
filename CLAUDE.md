# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Private Tutoring Management System - a full-stack application for teachers managing private lessons, students, groups, sessions, attendance, payments, quizzes, and announcements.

**Tech Stack:**
- Backend: Laravel 11 (REST API) with Sanctum authentication
- Frontend: Next.js 14 (App Router) with TypeScript
- Database: MySQL

## Repository Structure

```
Tutoring-System/
├── backend/          # Laravel 11 API
└── frontend/         # Next.js 14 App
```

## Commands

### Backend (Laravel)
```bash
cd backend

# Development server
php artisan serve

# Run tests (100% coverage required)
php artisan test --coverage --min=100

# Run specific test
php artisan test --filter=TestName

# Generate coverage HTML report
php artisan test --coverage-html=coverage

# Database migrations
php artisan migrate
php artisan migrate:fresh --seed

# Create model with migration, factory, seeder, controller
php artisan make:model ModelName -mfsc

# Create API controller
php artisan make:controller Api/ControllerName --api

# Create request/resource
php artisan make:request RequestName
php artisan make:resource ResourceName
```

### Frontend (Next.js)
```bash
cd frontend

# Development server
npm run dev

# Run tests
npm run test
npm run test:coverage

# Build
npm run build

# Lint
npm run lint
```

## Development Workflow

1. Before implementing any feature, create a detailed plan in a markdown file
2. Write unit and integration tests for all new features
3. Backend must maintain 100% test coverage
4. After each feature completion:
   - All tests must pass
   - Update CHECKLIST.md with progress
   - Commit with descriptive message
   - Push to GitHub
5. When modifying features, also update related translation files and tests
6. For unrelated features, complete and push each one before starting the next

## Architecture

### Backend Structure
- **Models:** Eloquent models with relationships (User roles: teacher/student/parent)
- **Controllers:** API controllers in `app/Http/Controllers/Api/`
- **Services:** Business logic in service classes (AttendanceService, PaymentService, QuizService, SessionGeneratorService)
- **Requests:** Form request validation classes
- **Resources:** API resource transformers
- **Enums:** AttendanceStatus, PaymentStatus, AnnouncementType

### Frontend Structure
- **App Router:** Route groups for (auth), (dashboard), (portal), and quiz
- **Components:** Organized by domain (ui/, layout/, forms/, students/, groups/, etc.)
- **Hooks:** Custom React Query hooks per domain (useAuth, useStudents, useGroups, etc.)
- **Store:** Zustand stores (authStore, uiStore, notificationStore)
- **Types:** TypeScript interfaces per domain
- **Lib:** API client (axios), utilities, validations (Zod)

### Key Packages
- Backend: Sanctum, Spatie Permission, DomPDF, Maatwebsite Excel
- Frontend: React Query, Zustand, React Hook Form, Zod, react-big-calendar, Recharts

## API Design

All API endpoints prefixed with `/api/`. Key resource groups:
- `/auth/*` - Authentication (register, login, logout, refresh, profile)
- `/students/*` - Student CRUD and related data
- `/groups/*` - Group management and student assignments
- `/sessions/*` - Session scheduling (today, week, month views)
- `/attendance/*` - Attendance tracking per session
- `/payments/*` - Payment recording and tracking (pending, overdue)
- `/exams/*` - Exam scheduling and results
- `/quizzes/*` - Quiz creation, questions, attempts
- `/announcements/*` - Announcement management
- `/notifications/*` - User notifications
- `/dashboard/*` - Dashboard statistics and widgets
- `/reports/*` - Attendance, payments, grades reports with export
- `/portal/*` - Student/parent portal endpoints

## Testing

### Backend Tests Location
- `tests/Unit/Models/` - Model unit tests
- `tests/Unit/Services/` - Service unit tests
- `tests/Feature/Api/` - API feature tests organized by module

### Frontend Tests Location
- `__tests__/components/` - Component tests
- `__tests__/hooks/` - Hook tests
- `__tests__/pages/` - Page tests

## Progress Tracking

CHECKLIST.md tracks implementation progress across 15 phases with status indicators for each task, test coverage, and documentation status.
