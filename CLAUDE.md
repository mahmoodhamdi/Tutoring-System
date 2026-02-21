# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Private Tutoring Management System - a full-stack Arabic (RTL) application for teachers managing private lessons, students, groups, sessions, attendance, payments, quizzes, and announcements.

**Tech Stack:**
- Backend: Laravel 11 (PHP 8.2+), REST API, Sanctum authentication
- Frontend: Next.js 16.1 (App Router), TypeScript, React 19, Tailwind CSS 4
- Database: MySQL (SQLite in-memory for tests)

## Commands

### Quick Start
```bash
make install    # Install all dependencies
make dev        # Start both servers (backend:8001, frontend:3000)
make test       # Run all tests
make lint       # Run all linters
make fresh      # Fresh database migrate and seed
```

### Backend
```bash
cd backend
php artisan serve --port=8001                          # Dev server
php artisan test --coverage --min=100                  # Tests (100% coverage required)
php artisan test --filter=TestName                     # Single test class
php artisan test tests/Feature/Api/Auth/LoginTest.php  # Single test file
./vendor/bin/pint                                      # Code style fixer
php artisan migrate:fresh --seed                       # Reset database
```

### Frontend
```bash
cd frontend
npm run dev              # Dev server (port 3000)
npm run test             # Jest unit tests
npm run test:watch       # Jest watch mode
npm run test:coverage    # Coverage report
npm run lint -- --fix    # ESLint with auto-fix
npm run type-check       # TypeScript check
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:ui      # E2E with Playwright UI
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

### Localization & RTL

The entire application is **Arabic-first with RTL layout**:
- Root HTML: `lang="ar" dir="rtl"` with Tajawal font (Google Fonts)
- All validation error messages, enum labels, toast notifications, and UI text are in Arabic
- Backend: FormRequest `messages()` return Arabic errors, Enum classes have Arabic `label()` methods
- Frontend: Toast notifications use `direction: 'rtl'`, positioned top-left
- Use RTL-aware Tailwind (e.g., `pr-64` for sidebar spacing, not `pl-64`)

### Authentication Flow

**Phone-based auth** (not email) — phone + password is the primary login method:
- Backend: Sanctum tokens for stateless API auth, CSRF cookies for stateful requests
- Frontend: `fetchCsrfCookie()` called before login/register, token stored in localStorage + cookies
- Middleware (`src/middleware.ts`): reads token from cookies, redirects unauthenticated users to `/login`
- Roles: `admin`, `teacher`, `student`, `parent` (via `UserRole` enum)
- User model has role helpers: `isTeacher()`, `isStudent()`, `isParent()`
- Parents can have multiple student children via `parent_id` relationship

### Backend Patterns

**Request lifecycle:** Route → Rate Limit Middleware → FormRequest (authorize + validate) → Controller → Eloquent + DB::transaction → Resource → JSON Response

- **Controllers** (`app/Http/Controllers/Api/`): One per domain, 15 total. Use route model binding, return Resources for single items, `AnonymousResourceCollection` for lists. Multi-table writes wrapped in `DB::transaction`.
- **FormRequests** (`app/Http/Requests/`): Handle both authorization (role checks in `authorize()`) and validation. All `messages()` return Arabic strings.
- **Resources** (`app/Http/Resources/`): 16 resource classes. Use `$this->when()` for conditional fields, handle pivot data, format dates as ISO 8601.
- **Enums** (`app/Enums/`): 5 enums (UserRole, AttendanceStatus, PaymentStatus, SessionStatus, QuizAttemptStatus). Each has Arabic `label()`, `color()` for UI, and boolean helper methods.
- **Services** (`app/Services/`): PdfExportService (DomPDF reports), SmsService. Business logic that doesn't belong in controllers.
- **Policies** (`app/Policies/`): Minimal — most authorization is inline in FormRequest `authorize()` or controller checks.

**API response shapes:**
```
Single:     { "data": { ... } }
Collection: { "data": [...], "meta": { current_page, last_page, per_page, total } }
Error:      { "message": "...", "errors": { "field": ["Arabic error"] } }
Success:    { "message": "Arabic success message" }
```

**Filtering/pagination:** Controllers accept `search`, `status`, `sort_by`, `sort_order`, `per_page` (max 100, default 15) query params.

**Rate limiting groups** in `routes/api.php`: `throttle:public`, `throttle:login`, `throttle:register`, `throttle:password-reset`, `throttle:reports-export`.

### Frontend Patterns

**Data fetching — React Query with key factories:**
```typescript
// Each hook (src/hooks/use{Domain}.ts) defines a key factory:
const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params) => [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id) => [...studentKeys.details(), id] as const,
};
// Mutations invalidate related keys on success
```
- QueryClient config: `staleTime: 60s`, `retry: 1` for queries, `0` for mutations, `refetchOnWindowFocus: false`
- Mutations show Arabic toast notifications on success/error via react-hot-toast

**Forms — React Hook Form + Zod:**
- Schemas in `src/lib/validations.ts` with Arabic error messages
- `zodResolver` connects Zod schemas to React Hook Form
- Type-safe form inputs via `z.infer<typeof schema>`

**State management:**
- Zustand for client state: `authStore` (user + token, persisted), `uiStore` (sidebar, theme), `notificationStore`
- React Query for all server state — no manual server data in Zustand

**API client** (`src/lib/axios.ts`):
- Axios with `withCredentials: true`, auto XSRF token headers
- Request interceptor adds Bearer token from localStorage
- Response interceptor handles 401 → clear token → redirect to `/login`
- Domain-specific API modules in `src/lib/api/` (students.ts, groups.ts, etc.)

**Error handling** (`src/lib/errorHandler.ts`):
- `getErrorMessage()` extracts messages from Axios/Error responses
- `getValidationErrors()` extracts 422 field errors
- Predefined Arabic message maps: `SUCCESS_MESSAGES`, `ERROR_MESSAGES`, `FIELD_ERRORS`

**Component conventions:**
- `'use client'` directive on interactive components
- UI primitives in `src/components/ui/` (Button, Input with variants, loading states, `cn()` class merging via clsx + twMerge)
- Domain components in `src/components/{domain}/` (StudentForm, GroupCard, etc.)
- `src/lib/utils.ts`: `formatDate()`, `formatTime()` (12h), `formatCurrency(amount, 'EGP')`, `debounce()`, `getInitials()`

### App Router Structure

```
src/app/
├── (auth)/           # Auth pages (centered layout)
│   ├── login/        # Phone + password login
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── dashboard/        # Teacher dashboard (sidebar layout)
│   ├── students/     # CRUD: list, [id], [id]/edit, new
│   ├── groups/       # Same CRUD pattern
│   ├── schedule/     # Sessions calendar
│   ├── payments/
│   ├── exams/
│   ├── quizzes/
│   ├── announcements/
│   ├── notifications/
│   ├── reports/
│   └── settings/
└── portal/           # Student/parent portal (separate layout)
```

## Testing

### Backend
- Feature tests in `tests/Feature/Api/{Module}/` — one directory per domain (Auth, Student, Group, Session, Dashboard, Exam, Notification, Payment, Portal, Quiz, Reports, Settings)
- Unit tests in `tests/Unit/Models/`
- Pattern: `RefreshDatabase` trait, `User::factory()->teacher()->create()` for setup, `actingAs()` + `postJson()`/`putJson()` for requests, `assertJsonPath()` + `assertDatabaseHas()` for assertions
- **100% coverage requirement enforced**

### Frontend
- Unit/component tests: `frontend/__tests__/` (Jest + Testing Library)
- E2E tests: `frontend/e2e/` (Playwright across Chromium, Firefox, WebKit, mobile viewports)
- E2E auth fixture: `e2e/fixtures/auth.fixture.ts` provides `authenticatedPage`, `adminPage`, `studentPage` helpers

## Environment

- Backend: `http://localhost:8001`
- Frontend: `http://localhost:3000`
- API Docs (Swagger): `http://localhost:8001/api/documentation`
- Backend `.env`: `SANCTUM_STATEFUL_DOMAINS=localhost:3000`
- Frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8001/api`

## Progress

CHECKLIST.md tracks implementation across 15 phases. Phases 1-4 (Setup, Auth, Students, Groups) are complete. Phase 5 (Sessions & Schedule) is next.
