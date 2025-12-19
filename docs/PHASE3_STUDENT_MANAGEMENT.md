# Phase 3: Student Management - Implementation Plan

## Overview
This phase implements the complete student management system, including student profiles, CRUD operations, and related data retrieval (attendance, payments, grades).

## Database Schema

### student_profiles Table
```sql
CREATE TABLE student_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    parent_id BIGINT UNSIGNED NULL,
    grade_level VARCHAR(50) NULL,
    school_name VARCHAR(255) NULL,
    address TEXT NULL,
    emergency_contact_name VARCHAR(255) NULL,
    emergency_contact_phone VARCHAR(20) NULL,
    notes TEXT NULL,
    enrollment_date DATE NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## API Endpoints

### Student Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/students | List all students | Yes (Teacher) |
| GET | /api/students/{id} | Get student details | Yes (Teacher/Student/Parent) |
| POST | /api/students | Create new student | Yes (Teacher) |
| PUT | /api/students/{id} | Update student | Yes (Teacher) |
| DELETE | /api/students/{id} | Delete student | Yes (Teacher) |
| GET | /api/students/{id}/attendance | Get student attendance | Yes (Teacher/Student/Parent) |
| GET | /api/students/{id}/payments | Get student payments | Yes (Teacher/Parent) |
| GET | /api/students/{id}/grades | Get student grades | Yes (Teacher/Student/Parent) |

## Backend Implementation

### 1. StudentProfile Model
- Located at: `app/Models/StudentProfile.php`
- Relationships:
  - `belongsTo` User (student)
  - `belongsTo` User (parent)
- Fillable fields: grade_level, school_name, address, emergency_contact_name, emergency_contact_phone, notes, enrollment_date, status, parent_id
- Casts: enrollment_date to date, status to enum

### 2. User Model Updates
- Add `studentProfile()` relationship (hasOne)
- Add `parentedStudents()` relationship (hasMany through StudentProfile)
- Add scope `students()` - filters users with role 'student'

### 3. StudentController
- Methods: index, show, store, update, destroy, attendance, payments, grades
- Uses StudentRequest for validation
- Uses StudentResource for API responses

### 4. Request Validation
- StoreStudentRequest: Validates creation with user data + profile data
- UpdateStudentRequest: Validates updates

### 5. Resources
- StudentResource: Transforms student data for API responses
- StudentProfileResource: Transforms profile data

## Frontend Implementation

### 1. Pages
- `/dashboard/students` - Students list with search & filter
- `/dashboard/students/[id]` - Student details page
- `/dashboard/students/new` - Add student form
- `/dashboard/students/[id]/edit` - Edit student form

### 2. Components
- `StudentsTable` - Data table with pagination, search, filters
- `StudentCard` - Profile card component
- `StudentForm` - Add/Edit form component
- `StudentProfileCard` - Detailed profile display

### 3. API Integration
- `useStudents` hook - Fetch students list
- `useStudent` hook - Fetch single student
- `useCreateStudent` mutation
- `useUpdateStudent` mutation
- `useDeleteStudent` mutation

### 4. Types
```typescript
interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'student';
  profile: StudentProfile;
  created_at: string;
}

interface StudentProfile {
  id: number;
  grade_level: string | null;
  school_name: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  notes: string | null;
  enrollment_date: string | null;
  status: 'active' | 'inactive' | 'suspended';
  parent?: User;
}
```

## Test Coverage

### Backend Tests (PHPUnit)
1. **Unit Tests**
   - StudentProfile model relationships
   - User model student scope
   - StudentResource transformation

2. **Feature Tests**
   - `GET /api/students` - List students (with/without auth, pagination, filters)
   - `GET /api/students/{id}` - Show student (found/not found, permissions)
   - `POST /api/students` - Create student (valid/invalid data, duplicates)
   - `PUT /api/students/{id}` - Update student (valid/invalid data)
   - `DELETE /api/students/{id}` - Delete student (soft delete, permissions)
   - `GET /api/students/{id}/attendance` - Get attendance (empty/with data)
   - `GET /api/students/{id}/payments` - Get payments (empty/with data)
   - `GET /api/students/{id}/grades` - Get grades (empty/with data)

### Frontend Tests (Jest)
1. **Component Tests**
   - StudentsTable renders correctly
   - StudentCard displays data
   - StudentForm validation
   - StudentProfileCard displays profile

2. **Integration Tests**
   - Students list page loads
   - Search functionality works
   - Add student flow
   - Edit student flow
   - Delete confirmation

## Implementation Steps

### Step 1: Backend Models & Migration
1. Create `student_profiles` migration
2. Create `StudentProfile` model with relationships
3. Update `User` model with student relationships
4. Run migration

### Step 2: Backend API
1. Create `StudentController`
2. Create `StoreStudentRequest` and `UpdateStudentRequest`
3. Create `StudentResource` and `StudentProfileResource`
4. Add routes to `api.php`

### Step 3: Backend Tests
1. Write unit tests for models
2. Write feature tests for all endpoints
3. Ensure 100% coverage

### Step 4: Frontend Types & API
1. Create student types in `types/student.ts`
2. Create API functions in `lib/api/students.ts`
3. Create React Query hooks in `hooks/useStudents.ts`

### Step 5: Frontend Components
1. Create `StudentsTable` component
2. Create `StudentCard` component
3. Create `StudentForm` component
4. Create `StudentProfileCard` component

### Step 6: Frontend Pages
1. Create students list page
2. Create student details page
3. Create add student page
4. Create edit student page

### Step 7: Frontend Tests
1. Write component tests
2. Write integration tests

### Step 8: Final
1. Run all tests
2. Update CHECKLIST.md
3. Commit and push

## Usage Flow

### Adding a New Student
1. Teacher navigates to `/dashboard/students`
2. Clicks "Add Student" button
3. Fills in the form:
   - Basic info: name, email, phone
   - Profile: grade level, school, address
   - Parent info (optional): select existing parent or create new
   - Emergency contact info
4. Submits form
5. System creates User with role 'student' and associated StudentProfile
6. Redirects to student details page

### Viewing Student Information
1. Teacher/Parent navigates to `/dashboard/students/{id}`
2. Views student profile card with all information
3. Can access tabs for:
   - Attendance history
   - Payment history
   - Grades/Results

### Managing Students
- Edit: Click edit button, modify form, save
- Delete: Click delete, confirm dialog, soft delete
- Filter: Use search box, grade level filter, status filter
- Sort: Click column headers in table

---

Last Updated: 2025-12-19
