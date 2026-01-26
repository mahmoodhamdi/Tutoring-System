# QA Exploration Document - Tutoring System
**Date:** 2026-01-26
**Project:** Private Tutoring Management System

---

## Tech Stack Identified

### Frontend:
- **Framework:** Next.js 16 (App Router)
- **UI Library:** Tailwind CSS, Headless UI, Heroicons
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query
- **Forms:** React Hook Form + Zod validation
- **Language:** TypeScript, React 19

### Backend:
- **Framework:** Laravel 11
- **Language:** PHP 8.2+
- **API Type:** REST API
- **Authentication:** Laravel Sanctum

### Database:
- **Type:** MySQL
- **ORM:** Eloquent

### Additional:
- **PDF Export:** DomPDF
- **Excel Export:** Maatwebsite Excel
- **Permissions:** Spatie Laravel Permission
- **E2E Testing:** Playwright

---

## User Roles & Permissions

| Role | Dashboard Access | Portal Access | Permissions |
|------|------------------|---------------|-------------|
| Admin | Yes | No | Full system access |
| Teacher | Yes | No | Manage students, groups, sessions, exams, quizzes |
| Student | No | Yes | View own attendance, grades, schedule |
| Parent | No | Yes | View children's data |

### Test Credentials (Phone-based login):
| Role | Phone | Password |
|------|-------|----------|
| Admin | 01000000000 | password |
| Teacher | 01111111111 | password |
| Student | 01122222220 | password |
| Parent | 0100000001 | password |

---

## Complete Feature Map

### Authentication & Authorization
| Feature | Route | Status |
|---------|-------|--------|
| Login (phone-based) | /login | Implemented |
| Register | /register | Implemented |
| Forgot Password | /forgot-password | Implemented |
| Reset Password | /reset-password | Implemented |
| Logout | Via button | Implemented |
| Protected Routes | Middleware | Implemented |

### Dashboard Pages (Teacher/Admin)
| Module | Pages | Features |
|--------|-------|----------|
| Dashboard | /dashboard | Stats cards, charts, recent activities |
| Students | /dashboard/students | CRUD, search, filter, profiles |
| Groups | /dashboard/groups | CRUD, add/remove students |
| Schedule/Sessions | /dashboard/schedule | CRUD, calendar view |
| Payments | /dashboard/payments | CRUD, payment tracking |
| Exams | /dashboard/exams | CRUD, results entry |
| Quizzes | /dashboard/quizzes | CRUD, questions, attempts |
| Announcements | /dashboard/announcements | CRUD, publish/unpublish |
| Notifications | /dashboard/notifications | View, mark read |
| Reports | /dashboard/reports | Various reports, export |
| Settings | /dashboard/settings | System settings |

### Portal Pages (Student/Parent)
| Page | Route | Features |
|------|-------|----------|
| Portal Home | /portal | Student/parent dashboard |
| Dashboard | /portal/dashboard | Overview stats |
| Attendance | /portal/attendance | View attendance history |
| Grades | /portal/grades | View exam/quiz results |

---

## Forms Identified

| Form | Location | Fields | Validation |
|------|----------|--------|------------|
| Login | /login | phone, password | Required, phone format |
| Register | /register | name, email (opt), phone, password, role | Zod validation |
| Student Form | /dashboard/students/new | name, email, phone, grade_level, etc. | Zod validation |
| Group Form | /dashboard/groups/new | name, subject, grade_level, fee, max_students | Zod validation |
| Session Form | /dashboard/schedule/new | group_id, date, start/end time, topic | Zod validation |
| Payment Form | /dashboard/payments/new | student_id, amount, method, date | Zod validation |
| Exam Form | /dashboard/exams/new | group_id, title, type, total_marks, date | Zod validation |
| Quiz Form | /dashboard/quizzes/new | group_id, title, duration, pass_percentage | Custom validation |
| Announcement Form | /dashboard/announcements/new | title, content, type, target, is_pinned | Zod validation |

---

## Components Identified

### UI Components
- Button, Input, Alert (in /components/ui/)
- ErrorBoundary

### Domain Components
- **Students:** StudentCard, StudentForm, StudentProfileCard, StudentsFilter, StudentsTable
- **Groups:** GroupCard, GroupForm, GroupsFilter, GroupsTable, GroupStudentsList, AddStudentsModal
- **Sessions:** SessionCard, SessionForm, SessionsList
- **Payments:** PaymentForm, PaymentsTable, PaymentStats
- **Exams:** ExamCard, ExamForm, ExamResultsTable
- **Quizzes:** QuizCard, QuizForm, QuestionForm, QuizTaker, QuizResults, AttemptsTable
- **Announcements:** AnnouncementCard, AnnouncementForm
- **Attendance:** AttendanceForm, AttendanceStats
- **Dashboard:** StatCard, AttendanceChart, PaymentChart, PerformanceCard, QuickStatsBar, RecentActivities, StudentStats, UpcomingSessions
- **Notifications:** NotificationDropdown, NotificationItem
- **Reports:** ReportCard, ReportFilters

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| POST | /api/auth/logout | Yes |
| POST | /api/auth/refresh | Yes |
| GET | /api/auth/me | Yes |
| PUT | /api/auth/profile | Yes |
| POST | /api/auth/change-password | Yes |
| POST | /api/auth/forgot-password | No |
| POST | /api/auth/reset-password | No |

### Resources (all require auth)
- /api/students - CRUD
- /api/groups - CRUD + student management
- /api/sessions - CRUD + attendance
- /api/attendance - CRUD
- /api/payments - CRUD + reports
- /api/exams - CRUD + results
- /api/quizzes - CRUD + questions + attempts
- /api/announcements - CRUD + publish
- /api/notifications - CRUD + mark read
- /api/dashboard - Stats
- /api/reports - Various reports + export
- /api/settings - CRUD

### Portal (separate auth)
- /api/portal/login
- /api/portal/profile
- /api/portal/dashboard
- /api/portal/attendance
- /api/portal/payments
- /api/portal/grades
- /api/portal/schedule
- /api/portal/announcements

---

## Test Plan

### Priority Matrix
| Priority | Features |
|----------|----------|
| P0 - Critical | Authentication, Core CRUD (Students, Groups) |
| P1 - High | Sessions, Payments, Exams, Search, Pagination |
| P2 - Medium | Quizzes, Announcements, Reports, Export |
| P3 - Low | Settings, Notifications, UI polish |

### Test Cases Summary
1. **TC-001:** Login with valid phone + password
2. **TC-002:** Login with invalid credentials
3. **TC-003:** Navigate to all dashboard pages
4. **TC-004:** CRUD Students
5. **TC-005:** CRUD Groups
6. **TC-006:** CRUD Sessions
7. **TC-007:** CRUD Payments
8. **TC-008:** CRUD Exams
9. **TC-009:** CRUD Quizzes
10. **TC-010:** CRUD Announcements
11. **TC-011:** Portal login (student)
12. **TC-012:** Portal features (attendance, grades)
13. **TC-013:** Search and filters
14. **TC-014:** Pagination
15. **TC-015:** Responsive design
16. **TC-016:** Error handling

---

## Environment Setup

- Backend: http://localhost:8001
- Frontend: http://localhost:3000
- API Base: http://localhost:8001/api
