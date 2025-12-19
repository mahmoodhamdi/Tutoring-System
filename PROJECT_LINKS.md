# Tutoring System - Project Links

## Servers
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000

---

## Frontend Pages

### Authentication
| Page | URL |
|------|-----|
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |

### Dashboard (Admin/Teacher)
| Page | URL |
|------|-----|
| Dashboard | http://localhost:3000/dashboard |

### Students Management
| Page | URL |
|------|-----|
| Students List | http://localhost:3000/students |
| Add Student | http://localhost:3000/students/new |
| Student Details | http://localhost:3000/students/[id] |

### Groups Management
| Page | URL |
|------|-----|
| Groups List | http://localhost:3000/groups |
| Add Group | http://localhost:3000/groups/new |
| Group Details | http://localhost:3000/groups/[id] |

### Sessions Management
| Page | URL |
|------|-----|
| Sessions List | http://localhost:3000/sessions |
| Add Session | http://localhost:3000/sessions/new |
| Session Details | http://localhost:3000/sessions/[id] |

### Attendance
| Page | URL |
|------|-----|
| Attendance | http://localhost:3000/attendance |

### Payments
| Page | URL |
|------|-----|
| Payments List | http://localhost:3000/payments |
| Add Payment | http://localhost:3000/payments/new |

### Exams
| Page | URL |
|------|-----|
| Exams List | http://localhost:3000/exams |
| Add Exam | http://localhost:3000/exams/new |
| Exam Details | http://localhost:3000/exams/[id] |

### Quizzes
| Page | URL |
|------|-----|
| Quizzes List | http://localhost:3000/quizzes |
| Add Quiz | http://localhost:3000/quizzes/new |
| Quiz Details | http://localhost:3000/quizzes/[id] |

### Announcements
| Page | URL |
|------|-----|
| Announcements List | http://localhost:3000/announcements |
| Add Announcement | http://localhost:3000/announcements/new |
| Announcement Details | http://localhost:3000/announcements/[id] |

### Reports
| Page | URL |
|------|-----|
| Reports | http://localhost:3000/reports |

---

## Student/Parent Portal
| Page | URL |
|------|-----|
| Portal Login | http://localhost:3000/portal |
| Portal Dashboard | http://localhost:3000/portal/dashboard |
| Attendance Record | http://localhost:3000/portal/attendance |
| Grades | http://localhost:3000/portal/grades |
| Payments | http://localhost:3000/portal/payments |
| Schedule | http://localhost:3000/portal/schedule |
| Announcements | http://localhost:3000/portal/announcements |

---

## API Endpoints

### Health Check
```
GET http://localhost:8000/api/health
```

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |
| POST | /api/auth/change-password | Change password |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | List all students |
| POST | /api/students | Create student |
| GET | /api/students/{id} | Get student |
| PUT | /api/students/{id} | Update student |
| DELETE | /api/students/{id} | Delete student |
| GET | /api/students/{id}/attendance | Student attendance |
| GET | /api/students/{id}/payments | Student payments |
| GET | /api/students/{id}/grades | Student grades |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/groups | List all groups |
| POST | /api/groups | Create group |
| GET | /api/groups/{id} | Get group |
| PUT | /api/groups/{id} | Update group |
| DELETE | /api/groups/{id} | Delete group |
| POST | /api/groups/{id}/students | Add students to group |
| DELETE | /api/groups/{id}/students/{studentId} | Remove student |
| GET | /api/groups/{id}/sessions | Group sessions |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/sessions | List all sessions |
| GET | /api/sessions/today | Today's sessions |
| GET | /api/sessions/week | This week's sessions |
| GET | /api/sessions/upcoming | Upcoming sessions |
| POST | /api/sessions | Create session |
| GET | /api/sessions/{id} | Get session |
| PUT | /api/sessions/{id} | Update session |
| DELETE | /api/sessions/{id} | Delete session |
| POST | /api/sessions/{id}/cancel | Cancel session |
| POST | /api/sessions/{id}/complete | Complete session |
| GET | /api/sessions/{id}/attendance | Session attendance |
| POST | /api/sessions/{id}/attendance | Record attendance |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/attendance | List attendance |
| POST | /api/attendance/bulk | Bulk record attendance |
| PUT | /api/attendance/{id} | Update attendance |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/payments | List payments |
| POST | /api/payments | Create payment |
| GET | /api/payments/{id} | Get payment |
| PUT | /api/payments/{id} | Update payment |
| DELETE | /api/payments/{id} | Delete payment |
| POST | /api/payments/{id}/pay | Mark as paid |

### Exams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/exams | List exams |
| POST | /api/exams | Create exam |
| GET | /api/exams/{id} | Get exam |
| PUT | /api/exams/{id} | Update exam |
| DELETE | /api/exams/{id} | Delete exam |
| POST | /api/exams/{id}/results | Add results |
| GET | /api/exams/{id}/results | Get results |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/quizzes | List quizzes |
| POST | /api/quizzes | Create quiz |
| GET | /api/quizzes/{id} | Get quiz |
| PUT | /api/quizzes/{id} | Update quiz |
| DELETE | /api/quizzes/{id} | Delete quiz |
| POST | /api/quizzes/{id}/questions | Add questions |
| POST | /api/quizzes/{id}/attempt | Start attempt |
| POST | /api/quizzes/{id}/submit | Submit attempt |

### Announcements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/announcements | List announcements |
| POST | /api/announcements | Create announcement |
| GET | /api/announcements/{id} | Get announcement |
| PUT | /api/announcements/{id} | Update announcement |
| DELETE | /api/announcements/{id} | Delete announcement |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notifications | List notifications |
| POST | /api/notifications/{id}/read | Mark as read |
| POST | /api/notifications/read-all | Mark all as read |
| DELETE | /api/notifications/{id} | Delete notification |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard | Dashboard statistics |
| GET | /api/dashboard/quick-stats | Quick stats |
| GET | /api/dashboard/recent-activities | Recent activities |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/types | Available report types |
| GET | /api/reports/attendance | Attendance report |
| GET | /api/reports/payments | Payments report |
| GET | /api/reports/performance | Performance report |
| GET | /api/reports/students | Students report |
| GET | /api/reports/sessions | Sessions report |
| GET | /api/reports/financial-summary | Financial summary |
| GET | /api/reports/export/csv | Export to CSV |
| GET | /api/reports/export/pdf | Export to PDF |

### Portal (Student/Parent)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/portal/login | Portal login |
| POST | /api/portal/logout | Portal logout |
| GET | /api/portal/profile | Get profile |
| GET | /api/portal/dashboard | Portal dashboard |
| GET | /api/portal/attendance | Attendance history |
| GET | /api/portal/payments | Payments history |
| GET | /api/portal/grades | Grades |
| GET | /api/portal/schedule | Schedule |
| GET | /api/portal/announcements | Announcements |
| GET | /api/portal/children | Children (for parents) |

---

## Documentation Files
| File | Path |
|------|------|
| Phase 11: Notifications | `docs/phase-11-notifications.md` |
| Phase 12: Dashboard | `docs/phase-12-dashboard-statistics.md` |
| Phase 13: Reports | `docs/phase-13-reports-export.md` |
| Phase 14: Portal | `docs/phase-14-student-parent-portal.md` |
| Phase 15: Final Polish | `docs/phase-15-final-polish-deployment.md` |
| Phase 16: Additional Features | `docs/phase-16-additional-features.md` |

---

## Quick Start

### 1. Start Backend
```powershell
cd D:\Tutoring-System\backend
php artisan serve
```

### 2. Start Frontend
```powershell
cd D:\Tutoring-System\frontend
npm run dev
```

### 3. Seed Demo Data (Optional)
```powershell
cd D:\Tutoring-System\backend
php artisan db:seed
```

### Demo Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Teacher | teacher@example.com | password |
| Student | student0@example.com | password |
| Parent | parent0@example.com | password |
