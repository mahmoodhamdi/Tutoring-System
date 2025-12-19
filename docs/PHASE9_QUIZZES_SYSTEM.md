# Phase 9: Quizzes System

## Overview
نظام الاختبارات التفاعلية - إنشاء اختبارات إلكترونية مع أسئلة متنوعة وتصحيح آلي.

## Database Schema

### quizzes table
```sql
CREATE TABLE quizzes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    group_id BIGINT NULL REFERENCES groups(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    instructions TEXT NULL,
    duration_minutes INT DEFAULT 30,
    total_marks DECIMAL(5,2) NOT NULL DEFAULT 0,
    pass_percentage DECIMAL(5,2) DEFAULT 60,
    max_attempts INT DEFAULT 1,
    shuffle_questions BOOLEAN DEFAULT FALSE,
    shuffle_answers BOOLEAN DEFAULT FALSE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    show_score_immediately BOOLEAN DEFAULT TRUE,
    available_from DATETIME NULL,
    available_until DATETIME NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### quiz_questions table
```sql
CREATE TABLE quiz_questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'short_answer', 'essay') DEFAULT 'multiple_choice',
    marks DECIMAL(4,2) NOT NULL DEFAULT 1,
    order_index INT DEFAULT 0,
    explanation TEXT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### quiz_options table
```sql
CREATE TABLE quiz_options (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_id BIGINT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### quiz_attempts table
```sql
CREATE TABLE quiz_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at DATETIME NOT NULL,
    completed_at DATETIME NULL,
    score DECIMAL(5,2) NULL,
    percentage DECIMAL(5,2) NULL,
    is_passed BOOLEAN NULL,
    time_taken_seconds INT NULL,
    status ENUM('in_progress', 'completed', 'timed_out', 'abandoned') DEFAULT 'in_progress',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### quiz_answers table
```sql
CREATE TABLE quiz_answers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    attempt_id BIGINT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    selected_option_id BIGINT NULL REFERENCES quiz_options(id) ON DELETE SET NULL,
    answer_text TEXT NULL,
    is_correct BOOLEAN NULL,
    marks_obtained DECIMAL(4,2) DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## API Endpoints

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/quizzes | List all quizzes |
| POST | /api/quizzes | Create new quiz |
| GET | /api/quizzes/{id} | Get quiz details |
| PUT | /api/quizzes/{id} | Update quiz |
| DELETE | /api/quizzes/{id} | Delete quiz |
| POST | /api/quizzes/{id}/publish | Publish quiz |
| POST | /api/quizzes/{id}/duplicate | Duplicate quiz |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/quizzes/{id}/questions | Get quiz questions |
| POST | /api/quizzes/{id}/questions | Add question to quiz |
| PUT | /api/questions/{id} | Update question |
| DELETE | /api/questions/{id} | Delete question |
| POST | /api/quizzes/{id}/questions/reorder | Reorder questions |

### Quiz Taking (Student)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/quizzes/available | List available quizzes |
| POST | /api/quizzes/{id}/start | Start quiz attempt |
| GET | /api/attempts/{id} | Get attempt details |
| POST | /api/attempts/{id}/answer | Submit answer |
| POST | /api/attempts/{id}/submit | Submit quiz |
| GET | /api/attempts/{id}/results | Get attempt results |

### Results
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/quizzes/{id}/attempts | Get all attempts for quiz |
| GET | /api/quizzes/{id}/statistics | Get quiz statistics |
| GET | /api/students/{id}/quiz-history | Student quiz history |

## Models

### Quiz Model
- Relationships: belongsTo Group, hasMany Questions, hasMany Attempts
- Scopes: published(), available(), byGroup()
- Computed: questions_count, total_marks, average_score

### QuizQuestion Model
- Relationships: belongsTo Quiz, hasMany Options
- Scopes: ordered()
- Methods: checkAnswer()

### QuizAttempt Model
- Relationships: belongsTo Quiz, belongsTo Student, hasMany Answers
- Scopes: completed(), inProgress()
- Methods: calculateScore(), submit()

## Frontend Components

### Components (Teacher)
- `QuizCard` - بطاقة الاختبار
- `QuizzesList` - قائمة الاختبارات
- `QuizForm` - نموذج إنشاء الاختبار
- `QuestionEditor` - محرر السؤال
- `OptionsEditor` - محرر الخيارات
- `QuizStats` - إحصائيات الاختبار
- `AttemptsList` - قائمة المحاولات

### Components (Student)
- `QuizTaker` - واجهة حل الاختبار
- `QuestionDisplay` - عرض السؤال
- `QuizResults` - عرض النتيجة
- `QuizTimer` - مؤقت الاختبار

### Pages (Teacher)
- `/dashboard/quizzes` - قائمة الاختبارات
- `/dashboard/quizzes/new` - إنشاء اختبار
- `/dashboard/quizzes/[id]` - تفاصيل الاختبار
- `/dashboard/quizzes/[id]/edit` - تعديل الاختبار
- `/dashboard/quizzes/[id]/questions` - إدارة الأسئلة
- `/dashboard/quizzes/[id]/attempts` - مراجعة المحاولات

### Pages (Student)
- `/quiz/available` - الاختبارات المتاحة
- `/quiz/[id]/start` - بدء الاختبار
- `/quiz/[id]/attempt` - صفحة الاختبار
- `/quiz/[id]/results` - نتيجة الاختبار

## Quiz Features
1. Multiple question types (MCQ, True/False, Short Answer, Essay)
2. Timer with auto-submit
3. Question shuffling
4. Answer shuffling
5. Multiple attempts support
6. Immediate or delayed results
7. Detailed answer explanations
8. Quiz duplication
9. Statistics and analytics

## Test Cases
1. Create quiz with questions
2. Add different question types
3. Publish quiz
4. Start quiz attempt
5. Submit answers
6. Auto-score MCQ/TF questions
7. Timer enforcement
8. Multiple attempts handling
9. Quiz statistics calculation
10. Student quiz history
