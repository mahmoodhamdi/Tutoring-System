# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Private Tutoring Management System - a full-stack application for teachers managing private lessons, students, groups, sessions, attendance, payments, quizzes, and announcements.

**Tech Stack:**
- Backend: Laravel 11 (REST API) with Sanctum authentication
- Frontend: Next.js 14 (App Router) with TypeScript
- Database: MySQL

## Commands

### Backend (Laravel)
```bash
cd backend

# Development server (runs on port 8001)
php artisan serve --port=8001

# Run tests (100% coverage required)
php artisan test --coverage --min=100

# Run specific test
php artisan test --filter=TestName

# Generate coverage HTML report
php artisan test --coverage-html=coverage

# Database migrations
php artisan migrate
php artisan migrate:fresh --seed

# Code style (Laravel Pint)
./vendor/bin/pint
```

### Frontend (Next.js)
```bash
cd frontend

# Development server (runs on port 3000)
npm run dev

# Run tests
npm run test
npm run test:watch
npm run test:coverage

# Build
npm run build

# Lint
npm run lint
npm run lint -- --fix
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
- **Models:** `app/Models/` - Eloquent models with relationships
- **Controllers:** `app/Http/Controllers/Api/` - REST API controllers
- **Requests:** `app/Http/Requests/` - Form request validation classes
- **Resources:** `app/Http/Resources/` - API response transformers
- **Enums:** `app/Enums/` - Status enums (UserRole, AttendanceStatus, PaymentStatus, SessionStatus, QuizAttemptStatus)
- **Services:** `app/Services/` - Business logic (PdfExportService, SmsService)
- **Policies:** `app/Policies/` - Authorization policies

### Backend Key Patterns
- User model has roles: teacher, student, parent (via `UserRole` enum)
- API routes defined in `routes/api.php` with rate limiting middleware (`throttle:public`, `throttle:login`, `throttle:register`, etc.)
- Tests organized by module in `tests/Feature/Api/{Module}/`

### Frontend Structure
- **App Router:** `src/app/` with route groups: `(auth)/`, `dashboard/`, `portal/`
- **Components:** `src/components/` - Organized by domain
- **Hooks:** `src/hooks/` - React Query hooks per domain (useAuth, useStudents, useGroups, etc.)
- **Store:** `src/store/` - Zustand stores (authStore, uiStore, notificationStore)
- **Types:** `src/types/` - TypeScript interfaces per domain
- **Lib:** `src/lib/` - API client (axios), utilities, Zod validations
- **Middleware:** `src/middleware.ts` - Auth protection for routes

### Key Dependencies
- Backend: Sanctum (auth), Spatie Permission (roles), DomPDF (PDF export), Maatwebsite Excel (CSV export), Laravel Phone (validation)
- Frontend: TanStack React Query (data fetching), Zustand (state), React Hook Form + Zod (forms), react-big-calendar (scheduling), Recharts (charts), Headless UI (components)

## API Structure

All endpoints prefixed with `/api/`. See `backend/routes/api.php` for complete route definitions. Key patterns:
- Public routes use `throttle:public` middleware
- Auth routes have specific rate limits (`throttle:login`, `throttle:register`, `throttle:password-reset`)
- Protected routes use `auth:sanctum` middleware
- Report exports use `throttle:reports-export` (expensive operations)
- Portal has separate auth flow via `/portal/login`

## Testing

### Backend Tests
- Feature tests: `tests/Feature/Api/{Module}/` - Organized by module (Auth, Student, Group, Session, etc.)
- Unit tests: `tests/Unit/Models/` - Model unit tests
- Run specific test file: `php artisan test tests/Feature/Api/Auth/LoginTest.php`

### Frontend Tests
- `__tests__/components/` - Component tests
- `__tests__/hooks/` - Hook tests
- `__tests__/pages/` - Page tests

## Environment

Backend: `http://localhost:8001`, Frontend: `http://localhost:3000`

Key env vars:
- Backend `.env`: `SANCTUM_STATEFUL_DOMAINS=localhost:3000`
- Frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8001/api`

## Progress

CHECKLIST.md tracks implementation progress across 15 phases. Currently completed: Setup, Auth, Students, Groups (phases 1-4).
