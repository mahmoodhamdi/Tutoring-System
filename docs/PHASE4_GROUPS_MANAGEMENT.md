# Phase 4: Groups Management - Implementation Plan

## Overview
This phase implements the groups management system, allowing teachers to organize students into study groups, manage group membership, and track group sessions.

## Database Schema

### groups Table
```sql
CREATE TABLE groups (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    subject VARCHAR(255) NULL,
    grade_level VARCHAR(50) NULL,
    max_students INT UNSIGNED DEFAULT 20,
    monthly_fee DECIMAL(10,2) DEFAULT 0.00,
    schedule_description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);
```

### group_student Pivot Table
```sql
CREATE TABLE group_student (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    joined_at DATE NOT NULL,
    left_at DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_group_student (group_id, student_id)
);
```

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/groups | List all groups | Yes (Teacher) |
| GET | /api/groups/{id} | Get group details | Yes (Teacher) |
| POST | /api/groups | Create new group | Yes (Teacher) |
| PUT | /api/groups/{id} | Update group | Yes (Teacher) |
| DELETE | /api/groups/{id} | Delete group | Yes (Teacher) |
| POST | /api/groups/{id}/students | Add students to group | Yes (Teacher) |
| DELETE | /api/groups/{id}/students/{studentId} | Remove student from group | Yes (Teacher) |
| GET | /api/groups/{id}/students | Get group students | Yes (Teacher) |
| GET | /api/groups/{id}/sessions | Get group sessions | Yes (Teacher) |

## Backend Implementation

### 1. Group Model
- Located at: `app/Models/Group.php`
- Relationships:
  - `belongsToMany` User (students) via group_student pivot
  - `hasMany` Session (future Phase 5)
- Fillable: name, description, subject, grade_level, max_students, monthly_fee, schedule_description, is_active
- SoftDeletes enabled

### 2. GroupController
- Methods: index, show, store, update, destroy, addStudents, removeStudent, students, sessions
- Uses GroupRequest for validation
- Uses GroupResource for API responses

### 3. Request Validation
- StoreGroupRequest: Validates creation
- UpdateGroupRequest: Validates updates
- AddStudentsRequest: Validates adding students

### 4. Resources
- GroupResource: Transforms group data
- GroupStudentResource: Transforms pivot data

## Frontend Implementation

### 1. Pages
- `/dashboard/groups` - Groups list with search & filter
- `/dashboard/groups/[id]` - Group details page
- `/dashboard/groups/new` - Create group form
- `/dashboard/groups/[id]/edit` - Edit group form

### 2. Components
- `GroupsTable` - Data table with pagination
- `GroupCard` - Group card component
- `GroupForm` - Add/Edit form component
- `GroupStudentsList` - List of students in group
- `AddStudentsModal` - Modal to add students

### 3. API Integration
- `useGroups` hook - Fetch groups list
- `useGroup` hook - Fetch single group
- `useCreateGroup` mutation
- `useUpdateGroup` mutation
- `useDeleteGroup` mutation
- `useAddStudents` mutation
- `useRemoveStudent` mutation

## Test Coverage

### Backend Tests
1. GroupIndexTest - List groups with filters
2. GroupStoreTest - Create group validation
3. GroupShowTest - View group details
4. GroupUpdateTest - Update group
5. GroupDestroyTest - Delete group
6. GroupStudentsTest - Add/Remove students

### Frontend Tests
1. GroupsTable tests
2. GroupCard tests
3. GroupForm tests
4. GroupStudentsList tests

## Implementation Steps

1. Create migrations (groups, group_student)
2. Create Group model with relationships
3. Create GroupController with all methods
4. Create request validation classes
5. Create resource classes
6. Add routes
7. Write backend tests
8. Create frontend types and API
9. Create frontend components
10. Create frontend pages
11. Write frontend tests
12. Update CHECKLIST.md
13. Commit and push

---

Last Updated: 2025-12-19
