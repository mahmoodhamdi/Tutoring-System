# البنية المعمارية | Architecture

## نظرة عامة | System Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │     │    Nginx     │     │    MySQL     │
│  (Next.js)   │────▶│  (Reverse    │────▶│   8.0        │
│  Port 3000   │     │   Proxy)     │     │  Port 3306   │
└──────────────┘     │  Port 80/443 │     └──────────────┘
                     └──────┬───────┘            ▲
                            │                    │
                     ┌──────▼───────┐     ┌──────┴───────┐
                     │   Laravel    │────▶│    Redis      │
                     │  (PHP-FPM)  │     │  Port 6379   │
                     │  Port 9000  │     └──────────────┘
                     └──────┬───────┘
                            │
                     ┌──────▼───────┐
                     │ Queue Worker │
                     │ + Scheduler  │
                     └──────────────┘
```

---

## Backend Architecture

### Request Lifecycle

```
HTTP Request
    │
    ▼
Route (routes/api.php)
    │
    ├── Rate Limit Middleware (throttle:group)
    │
    ├── Sanctum Auth Middleware
    │
    ▼
FormRequest
    ├── authorize()        → Role check (returns 403)
    ├── prepareForValidation() → XSS sanitization (strip_tags)
    └── rules() + messages() → Validation (returns 422 Arabic errors)
    │
    ▼
Controller
    ├── Route Model Binding (auto 404)
    ├── Business Logic
    ├── DB::transaction (multi-table writes)
    └── Return Resource (JSON transform)
    │
    ▼
API Resource → JSON Response
```

### Directory Structure

```
app/
├── Enums/                  # 5 typed enums with Arabic labels
│   ├── UserRole.php        # admin, teacher, student, parent
│   ├── AttendanceStatus.php # present, absent, late, excused
│   ├── PaymentStatus.php   # paid, pending, overdue, cancelled
│   ├── SessionStatus.php   # scheduled, completed, cancelled
│   └── QuizAttemptStatus.php # in_progress, completed, timed_out, abandoned
│
├── Http/
│   ├── Controllers/Api/    # 15 controllers (REST)
│   │   ├── AuthController          # 429 LOC
│   │   ├── StudentController       # 303 LOC
│   │   ├── GroupController         # 290 LOC
│   │   ├── SessionController       # 210 LOC
│   │   ├── AttendanceController    # 194 LOC
│   │   ├── PaymentController       # 218 LOC
│   │   ├── ExamController          # 277 LOC
│   │   ├── QuizController          # 449 LOC
│   │   ├── AnnouncementController  # 284 LOC
│   │   ├── NotificationController  # 242 LOC
│   │   ├── DashboardController     # 628 LOC
│   │   ├── ReportsController       # 948 LOC
│   │   ├── PortalController        # 624 LOC
│   │   ├── SettingController       # 155 LOC
│   │   └── HealthController        # 65 LOC
│   │
│   ├── Middleware/
│   │   ├── PerformanceMonitoring   # Response time tracking
│   │   ├── RequestLogging          # Request/response logging
│   │   └── SecurityHeaders         # OWASP headers
│   │
│   ├── Requests/           # 20+ FormRequest classes
│   │   ├── Auth/           # Register, Login, UpdateProfile, ChangePassword
│   │   ├── Student/        # Store, Update
│   │   ├── Group/          # Store, Update
│   │   ├── Exam/           # Store, Update
│   │   ├── Quiz/           # Store, Update
│   │   └── Announcement/   # Store, Update
│   │
│   └── Resources/          # 16 API Resource transformers
│
├── Models/                 # 14 Eloquent models
│   ├── User.php            # Roles, relationships, scopes
│   ├── Group.php
│   ├── Session.php (TutoringSession)
│   ├── Attendance.php
│   ├── Payment.php
│   ├── Exam.php / ExamResult.php
│   ├── Quiz.php / QuizQuestion.php / QuizOption.php
│   ├── QuizAttempt.php / QuizAnswer.php
│   ├── Announcement.php
│   └── Setting.php
│
└── Services/
    ├── PdfExportService    # DomPDF report generation
    └── SmsService          # Multi-provider SMS
```

### API Response Patterns

```jsonc
// Single resource
{ "data": { "id": 1, "name": "...", ... } }

// Collection (paginated)
{ "data": [...], "meta": { "current_page": 1, "last_page": 5, "per_page": 15, "total": 72 } }

// Validation error (422)
{ "message": "بيانات غير صالحة", "errors": { "phone": ["رقم الهاتف مطلوب"] } }

// Success message
{ "message": "تم الحفظ بنجاح" }

// Auth error (401)
{ "message": "غير مصرح. يرجى تسجيل الدخول" }
```

---

## Frontend Architecture

### App Router Structure

```
src/app/
├── layout.tsx              # Root: <html lang="ar" dir="rtl">, Providers
├── page.tsx                # Landing/redirect
│
├── (auth)/                 # Auth group layout (centered, no sidebar)
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
│
├── dashboard/              # Teacher dashboard (sidebar layout)
│   ├── layout.tsx          # Sidebar + header + main content
│   ├── page.tsx            # Dashboard home (stats, charts)
│   ├── students/           # CRUD pattern
│   │   ├── page.tsx        # List (table + search + filters)
│   │   ├── new/page.tsx    # Create form
│   │   ├── [id]/page.tsx   # Detail view
│   │   └── [id]/edit/page.tsx # Edit form
│   ├── groups/             # Same CRUD pattern
│   ├── schedule/           # Sessions
│   ├── payments/
│   ├── exams/
│   ├── quizzes/
│   ├── announcements/
│   ├── notifications/
│   ├── reports/
│   └── settings/
│
└── portal/                 # Student/parent portal
    ├── layout.tsx          # Simpler layout
    ├── page.tsx            # Portal home
    ├── dashboard/page.tsx
    ├── attendance/page.tsx
    └── grades/page.tsx
```

### State Management

```
┌─────────────────────────────────────────┐
│              React Query                 │
│  (All server state: API data)           │
│                                         │
│  Key Factories per domain:              │
│  studentKeys.all → ['students']         │
│  studentKeys.list(params) → [...]       │
│  studentKeys.detail(id) → [...]         │
│                                         │
│  Config: staleTime 60s, retry 1         │
│  Mutations invalidate related keys      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              Zustand Stores              │
│  (Client-only state)                    │
│                                         │
│  authStore:          persist to storage │
│    - user, token, login(), logout()     │
│                                         │
│  uiStore:            no persist         │
│    - sidebarOpen, theme                 │
│                                         │
│  notificationStore:  no persist         │
│    - unreadCount, notifications         │
└─────────────────────────────────────────┘
```

### Data Flow

```
Page Component
    │
    ├── useStudents() hook (React Query)
    │   ├── Calls api.students.list(params)
    │   │   └── Axios GET /api/students?search=...
    │   └── Returns { data, isLoading, error }
    │
    ├── React Hook Form + Zod
    │   ├── Schema validation (Arabic messages)
    │   └── onSubmit → mutation.mutate(data)
    │
    └── Mutation
        ├── api.students.create(data)
        ├── onSuccess → invalidate queries + toast
        └── onError → toast Arabic error
```

### Component Organization

```
src/components/
├── ui/                     # Primitives (Button, Input, Modal, etc.)
│   ├── Button.tsx          # Variants: primary/secondary/outline/ghost/danger
│   ├── Input.tsx           # With error state, RTL support
│   ├── Select.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   └── ...
│
├── layout/                 # Layout components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── ...
│
├── students/               # Domain components
│   ├── StudentForm.tsx
│   ├── StudentCard.tsx
│   ├── StudentsTable.tsx
│   └── StudentsFilter.tsx
│
├── groups/
├── sessions/
├── payments/
├── quizzes/
└── ...
```

### API Client

```
src/lib/
├── axios.ts               # Configured Axios instance
│   ├── baseURL: process.env.NEXT_PUBLIC_API_URL
│   ├── withCredentials: true
│   ├── Request interceptor: Bearer token
│   └── Response interceptor: 401 → logout
│
├── api/                   # Domain API modules
│   ├── students.ts        # CRUD functions
│   ├── groups.ts
│   ├── sessions.ts
│   └── ...
│
├── validations.ts         # Zod schemas (Arabic errors)
├── errorHandler.ts        # Error message extraction
└── utils.ts               # formatDate, formatCurrency, etc.
```

---

## RTL Design System

- Root: `<html lang="ar" dir="rtl">`
- Font: Tajawal (Google Fonts)
- Tailwind: RTL-aware classes (`pr-64` for sidebar gap, `ml-2` for spinner)
- Toast: `direction: 'rtl'`, position top-left
- All text: Arabic-first
- All validation messages: Arabic
- All enum labels: Arabic via `label()` methods
