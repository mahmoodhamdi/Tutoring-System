# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Private Tutoring Management System - a full-stack application for teachers managing private lessons, students, groups, sessions, attendance, payments, quizzes, and announcements.

**Tech Stack:**
- Backend: Laravel 11 (REST API) with Sanctum authentication
- Frontend: Next.js 16.1 (App Router) with TypeScript, React 19
- Database: MySQL

## Commands

### Quick Start (Using Makefile)
```bash
make install    # Install all dependencies
make dev        # Start both servers (backend:8001, frontend:3000)
make test       # Run all tests
make lint       # Run all linters
make fresh      # Fresh database migrate and seed
```

### Backend (Laravel)
```bash
cd backend
php artisan serve --port=8001          # Dev server
php artisan test --coverage --min=100  # Tests (100% coverage required)
php artisan test --filter=TestName     # Specific test
php artisan test tests/Feature/Api/Auth/LoginTest.php  # Specific file
./vendor/bin/pint                      # Code style
php artisan migrate:fresh --seed       # Reset database
```

### Frontend (Next.js)
```bash
cd frontend
npm run dev              # Dev server (port 3000)
npm run test             # Run tests
npm run test:coverage    # With coverage
npm run lint -- --fix    # Fix lint issues
npm run type-check       # TypeScript check
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:ui      # E2E with UI
```

### Docker
```bash
make docker-up      # Start containers
make docker-fresh   # Fresh migrate and seed
make docker-shell   # Shell into backend container
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
- **Controllers:** `app/Http/Controllers/Api/` - One controller per domain
- **Requests:** `app/Http/Requests/` - Form request validation classes
- **Resources:** `app/Http/Resources/` - API response transformers
- **Models:** `app/Models/` - Eloquent models with relationships
- **Enums:** `app/Enums/` - UserRole, AttendanceStatus, PaymentStatus, SessionStatus, QuizAttemptStatus
- **Services:** `app/Services/` - Business logic (PdfExportService, SmsService)
- **Policies:** `app/Policies/` - Authorization policies

### Backend Key Patterns
- User model has roles: teacher, student, parent (via `UserRole` enum)
- API routes in `routes/api.php` with rate limiting middleware:
  - `throttle:public` - Public routes (health, public settings)
  - `throttle:login`, `throttle:register`, `throttle:password-reset` - Auth routes
  - `throttle:reports-export` - Expensive export operations
- Route model binding used for resource routes (e.g., `{student}`, `{group}`)
- Tests organized by module in `tests/Feature/Api/{Module}/`

### Frontend Structure
- **App Router:** `src/app/` with route groups:
  - `(auth)/` - Login, register, forgot password, reset password
  - `dashboard/` - Teacher dashboard with nested routes for all modules
  - `portal/` - Student/parent portal
- **Components:** `src/components/` - Organized by domain (students/, groups/, sessions/, etc.)
- **Hooks:** `src/hooks/` - React Query hooks per domain (useAuth, useStudents, useGroups, useSessions, usePayments, useExams, useQuizzes, useAnnouncements, useNotifications, useReports, usePortal, useSettings, useDashboard)
- **Store:** `src/store/` - Zustand stores (authStore, uiStore, notificationStore)
- **Types:** `src/types/` - TypeScript interfaces per domain
- **Lib:** `src/lib/` - API client (axios), utilities, Zod validations
- **Middleware:** `src/middleware.ts` - Auth protection for routes

### Key Dependencies
- **Backend:** Sanctum (auth), Spatie Permission (roles), DomPDF (PDF), Maatwebsite Excel (CSV), Laravel Phone (validation), L5-Swagger (API docs), Sentry (error tracking)
- **Frontend:** TanStack React Query v5 (data fetching), Zustand (state), React Hook Form + Zod v4 (forms), react-big-calendar (scheduling), Recharts (charts), Headless UI v2 + Heroicons v2 (components), Playwright (E2E), date-fns v4

## API Patterns

All endpoints prefixed with `/api/`. Key endpoint groups:
- `/api/auth/*` - Authentication (login, register, logout, password reset)
- `/api/students/*`, `/api/groups/*`, `/api/sessions/*` - CRUD resources
- `/api/attendance/*`, `/api/payments/*`, `/api/exams/*`, `/api/quizzes/*` - Domain-specific resources
- `/api/announcements/*`, `/api/notifications/*` - Communication
- `/api/dashboard/*` - Dashboard statistics and quick stats
- `/api/reports/*` - Report generation and export (CSV/PDF)
- `/api/portal/*` - Student/parent portal (separate login flow)
- `/api/settings/*` - System settings (public and protected)

## Testing

### Backend
- Feature tests: `tests/Feature/Api/{Module}/` (Auth, Student, Group, Session, etc.)
- Unit tests: `tests/Unit/Models/`
- 100% coverage requirement enforced

### Frontend
- Component tests: `__tests__/components/`
- Hook tests: `__tests__/hooks/`
- Page tests: `__tests__/pages/`
- E2E tests: `e2e/` (Playwright)

## Environment

- Backend: `http://localhost:8001`
- Frontend: `http://localhost:3000`
- API Docs: `http://localhost:8001/api/documentation` (Swagger)

Key env vars:
- Backend `.env`: `SANCTUM_STATEFUL_DOMAINS=localhost:3000`
- Frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8001/api`

## Progress

CHECKLIST.md tracks implementation progress across 15 phases. See CHECKLIST.md for detailed status.
