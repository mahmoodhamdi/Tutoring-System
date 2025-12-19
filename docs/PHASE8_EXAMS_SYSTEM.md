# Phase 8: Exams System

## Overview
نظام إدارة الاختبارات - إنشاء وجدولة الاختبارات وتسجيل درجات الطلاب.

## Database Schema

### exams table
```sql
CREATE TABLE exams (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NULL,
    duration_minutes INT DEFAULT 60,
    total_marks DECIMAL(5,2) NOT NULL,
    pass_marks DECIMAL(5,2) NULL,
    exam_type ENUM('quiz', 'midterm', 'final', 'assignment') DEFAULT 'quiz',
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    instructions TEXT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### exam_results table
```sql
CREATE TABLE exam_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    exam_id BIGINT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2) NULL,
    percentage DECIMAL(5,2) NULL,
    grade VARCHAR(5) NULL,
    status ENUM('pending', 'submitted', 'graded', 'absent') DEFAULT 'pending',
    feedback TEXT NULL,
    graded_by BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    graded_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(exam_id, student_id)
);
```

## API Endpoints

### Exams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/exams | List all exams |
| GET | /api/exams/upcoming | List upcoming exams |
| GET | /api/exams/recent | List recent exams |
| POST | /api/exams | Create new exam |
| GET | /api/exams/{id} | Get exam details |
| PUT | /api/exams/{id} | Update exam |
| DELETE | /api/exams/{id} | Delete exam |
| POST | /api/exams/{id}/publish | Publish exam |
| POST | /api/exams/{id}/cancel | Cancel exam |

### Exam Results
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/exams/{id}/results | Get all results for exam |
| POST | /api/exams/{id}/results | Record results for exam |
| PUT | /api/exams/{exam}/results/{student} | Update student result |
| GET | /api/students/{id}/exams | Get student's exam history |

## Models

### Exam Model
- Relationships: belongsTo Group, hasMany ExamResults
- Scopes: scheduled(), completed(), upcoming(), byGroup()
- Computed: is_past, is_upcoming, results_count, average_marks

### ExamResult Model
- Relationships: belongsTo Exam, belongsTo Student, belongsTo GradedBy
- Scopes: graded(), pending(), passed(), failed()
- Computed: is_passed, grade_label

## Frontend Components

### Components
- `ExamCard` - عرض بطاقة الاختبار
- `ExamsList` - قائمة الاختبارات
- `ExamForm` - نموذج إنشاء/تعديل الاختبار
- `ExamResultsTable` - جدول نتائج الاختبار
- `ExamResultForm` - نموذج إدخال النتيجة
- `ExamStats` - إحصائيات الاختبار

### Pages
- `/dashboard/exams` - قائمة الاختبارات
- `/dashboard/exams/new` - إنشاء اختبار
- `/dashboard/exams/[id]` - تفاصيل الاختبار والنتائج
- `/dashboard/exams/[id]/edit` - تعديل الاختبار
- `/dashboard/exams/[id]/results` - إدخال/تعديل النتائج

## Validation Rules

### StoreExamRequest
```php
'group_id' => 'required|exists:groups,id',
'title' => 'required|string|max:255',
'description' => 'nullable|string|max:2000',
'exam_date' => 'required|date|after_or_equal:today',
'start_time' => 'nullable|date_format:H:i',
'duration_minutes' => 'nullable|integer|min:15|max:480',
'total_marks' => 'required|numeric|min:1|max:1000',
'pass_marks' => 'nullable|numeric|min:0|lte:total_marks',
'exam_type' => 'required|in:quiz,midterm,final,assignment',
'instructions' => 'nullable|string|max:5000',
```

### RecordExamResultsRequest
```php
'results' => 'required|array|min:1',
'results.*.student_id' => 'required|exists:users,id',
'results.*.marks_obtained' => 'nullable|numeric|min:0|lte:exam.total_marks',
'results.*.status' => 'required|in:pending,submitted,graded,absent',
'results.*.feedback' => 'nullable|string|max:1000',
```

## Grade Calculation
- A+: 95-100%
- A: 90-94%
- B+: 85-89%
- B: 80-84%
- C+: 75-79%
- C: 70-74%
- D: 60-69%
- F: Below 60%

## Test Cases
1. Create exam with valid data
2. Create exam with past date (should fail)
3. Update exam details
4. Publish exam
5. Cancel exam
6. Record student results
7. Calculate grades automatically
8. Get exam statistics
9. Filter exams by status/group
10. Student exam history
