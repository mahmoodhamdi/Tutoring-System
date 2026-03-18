# مخطط قاعدة البيانات | Database Schema

## نظرة عامة | Overview

- **Database:** MySQL 8.0 (SQLite in-memory for tests)
- **ORM:** Eloquent (Laravel)
- **Tables:** 28
- **Migrations:** 15

---

## الجداول | Tables

### users
المستخدمون (معلم، طالب، ولي أمر، مدير)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK, auto | المعرف |
| name | varchar(255) | required | الاسم |
| email | varchar(255) | nullable, unique | البريد الإلكتروني |
| phone | varchar(20) | required, unique | رقم الهاتف |
| password | varchar(255) | required | كلمة المرور (bcrypt) |
| role | enum | teacher/student/parent/admin | الدور |
| parent_id | bigint | nullable, FK→users | ولي الأمر |
| date_of_birth | date | nullable | تاريخ الميلاد |
| gender | enum | nullable, male/female | الجنس |
| is_active | boolean | default true | نشط |
| email_verified_at | timestamp | nullable | تاريخ تأكيد البريد |
| remember_token | varchar(100) | nullable | - |
| created_at | timestamp | - | - |
| updated_at | timestamp | - | - |

**Indexes:** email (unique), phone (unique), role, parent_id

---

### student_profiles
بيانات الطالب الإضافية

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | المعرف |
| user_id | bigint | FK→users, unique | الطالب |
| grade_level | varchar(50) | nullable | المرحلة الدراسية |
| school_name | varchar(255) | nullable | المدرسة |
| address | text | nullable | العنوان |
| emergency_contact_name | varchar(255) | nullable | جهة اتصال طارئة |
| emergency_contact_phone | varchar(20) | nullable | هاتف الطوارئ |
| notes | text | nullable | ملاحظات |
| enrollment_date | date | nullable | تاريخ التسجيل |
| status | enum | active/inactive/suspended | الحالة |

---

### groups
المجموعات الدراسية

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | المعرف |
| teacher_id | bigint | FK→users | المعلم |
| name | varchar(255) | required | اسم المجموعة |
| description | text | nullable | الوصف |
| subject | varchar(255) | nullable | المادة |
| grade_level | varchar(50) | nullable | المرحلة |
| max_students | int | nullable, default 20 | الحد الأقصى |
| monthly_fee | decimal(10,2) | nullable | الرسوم الشهرية |
| schedule_description | varchar(1000) | nullable | وصف الجدول |
| is_active | boolean | default true | نشطة |

---

### group_student (Pivot)
علاقة الطلاب بالمجموعات

| Column | Type | Constraints |
|--------|------|-------------|
| group_id | bigint | FK→groups |
| student_id | bigint | FK→users |
| joined_at | timestamp | nullable |
| status | enum | active/inactive |

**Unique:** (group_id, student_id)

---

### tutoring_sessions
الحصص الدراسية

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | المعرف |
| group_id | bigint | FK→groups | المجموعة |
| title | varchar(255) | nullable | العنوان |
| session_date | date | required | التاريخ |
| start_time | time | required | وقت البداية |
| end_time | time | required | وقت النهاية |
| status | enum | scheduled/completed/cancelled | الحالة |
| location | varchar(255) | nullable | المكان |
| notes | text | nullable | ملاحظات |
| is_recurring | boolean | default false | متكررة |

---

### attendances
سجلات الحضور

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | المعرف |
| session_id | bigint | FK→tutoring_sessions | الحصة |
| student_id | bigint | FK→users | الطالب |
| status | enum | present/absent/late/excused | الحالة |
| notes | text | nullable | ملاحظات |

**Unique:** (session_id, student_id)

---

### payments
المدفوعات

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | المعرف |
| student_id | bigint | FK→users | الطالب |
| group_id | bigint | FK→groups, nullable | المجموعة |
| amount | decimal(10,2) | required | المبلغ |
| payment_date | date | required | تاريخ الدفع |
| due_date | date | nullable | تاريخ الاستحقاق |
| status | enum | paid/pending/overdue/cancelled | الحالة |
| payment_method | varchar(50) | nullable | طريقة الدفع |
| description | text | nullable | الوصف |
| month | varchar(7) | nullable | الشهر (YYYY-MM) |

---

### exams
الاختبارات

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | المعرف |
| group_id | bigint | FK→groups | المجموعة |
| title | varchar(255) | required | العنوان |
| description | text | nullable | الوصف |
| exam_date | date | required | التاريخ |
| start_time | time | nullable | وقت البداية |
| duration_minutes | int | nullable | المدة |
| total_marks | decimal(8,2) | required | الدرجة الكلية |
| pass_marks | decimal(8,2) | nullable | درجة النجاح |
| exam_type | enum | quiz/midterm/final/assignment | النوع |
| instructions | text | nullable | التعليمات |
| is_published | boolean | default false | منشور |
| status | enum | scheduled/in_progress/completed/cancelled | الحالة |

---

### exam_results
نتائج الاختبارات

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK |
| exam_id | bigint | FK→exams |
| student_id | bigint | FK→users |
| score | decimal(8,2) | nullable |
| percentage | decimal(5,2) | nullable |
| grade | varchar(10) | nullable |
| feedback | text | nullable |

**Unique:** (exam_id, student_id)

---

### quizzes
الاختبارات الإلكترونية

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK |
| group_id | bigint | FK→groups, nullable |
| teacher_id | bigint | FK→users |
| title | varchar(255) | required |
| description | text | nullable |
| instructions | text | nullable |
| duration_minutes | int | required |
| pass_percentage | decimal(5,2) | required |
| max_attempts | int | default 1 |
| shuffle_questions | boolean | default false |
| shuffle_answers | boolean | default false |
| show_correct_answers | boolean | default true |
| show_score_immediately | boolean | default true |
| is_published | boolean | default false |
| available_from | datetime | nullable |
| available_until | datetime | nullable |
| total_marks | decimal(8,2) | default 0 |

---

### quiz_questions

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK |
| quiz_id | bigint | FK→quizzes |
| question_text | text | required |
| question_type | enum | multiple_choice/true_false/short_answer |
| marks | decimal(5,2) | required |
| order | int | default 0 |
| explanation | text | nullable |

---

### quiz_options

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK |
| question_id | bigint | FK→quiz_questions |
| option_text | text | required |
| is_correct | boolean | default false |
| order | int | default 0 |

---

### quiz_attempts

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK |
| quiz_id | bigint | FK→quizzes |
| student_id | bigint | FK→users |
| started_at | datetime | required |
| submitted_at | datetime | nullable |
| completed_at | datetime | nullable |
| score | decimal(8,2) | nullable |
| percentage | decimal(5,2) | nullable |
| is_passed | boolean | nullable |
| time_taken_seconds | int | nullable |
| status | enum | in_progress/completed/timed_out/abandoned |

---

### quiz_answers

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK |
| attempt_id | bigint | FK→quiz_attempts |
| question_id | bigint | FK→quiz_questions |
| selected_option_id | bigint | FK→quiz_options, nullable |
| answer_text | text | nullable |
| is_correct | boolean | nullable |
| marks_obtained | decimal(5,2) | default 0 |

---

### announcements
الإعلانات

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK |
| teacher_id | bigint | FK→users |
| group_id | bigint | FK→groups, nullable |
| title | varchar(255) | required |
| content | text | required |
| priority | enum | low/normal/high/urgent |
| type | enum | general/schedule/exam/payment/event |
| is_pinned | boolean | default false |
| is_published | boolean | default false |
| published_at | datetime | nullable |
| expires_at | datetime | nullable |

---

### announcement_reads

| Column | Type | Constraints |
|--------|------|-------------|
| announcement_id | bigint | FK→announcements |
| user_id | bigint | FK→users |
| read_at | timestamp | - |

**Unique:** (announcement_id, user_id)

---

### notifications

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| type | varchar(255) | - |
| notifiable_type | varchar(255) | polymorphic |
| notifiable_id | bigint | polymorphic |
| data | json | - |
| read_at | timestamp | nullable |

---

### settings

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK |
| key | varchar(255) | unique |
| value | text | nullable |
| type | varchar(50) | default 'string' |
| group | varchar(100) | nullable |

---

## مخطط العلاقات | ER Diagram

```
users ──────────────── student_profiles (1:1)
  │
  ├── groups (teacher_id, 1:N)
  │     ├── group_student (N:M pivot)
  │     ├── tutoring_sessions (1:N)
  │     │     └── attendances (1:N)
  │     ├── exams (1:N)
  │     │     └── exam_results (1:N)
  │     ├── quizzes (1:N)
  │     │     ├── quiz_questions (1:N)
  │     │     │     └── quiz_options (1:N)
  │     │     └── quiz_attempts (1:N)
  │     │           └── quiz_answers (1:N)
  │     ├── payments (1:N)
  │     └── announcements (1:N)
  │           └── announcement_reads (1:N)
  │
  ├── payments (student_id, 1:N)
  ├── quiz_attempts (student_id, 1:N)
  ├── attendances (student_id, 1:N)
  ├── notifications (notifiable_id, 1:N)
  └── users (parent_id → self, parent→children)
```

---

## Performance Indexes

Added in migration `2025_12_19_300000_add_performance_indexes.php`:
- Composite indexes on frequently joined/filtered columns
- Index on `session_date`, `status`, `payment_date`, `due_date`
- Index on pivot table columns
