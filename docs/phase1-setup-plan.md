# Phase 1: Project Setup & Infrastructure - Implementation Plan

## Overview
This phase sets up the foundational infrastructure for the Private Tutoring Management System, including both the Laravel backend API and Next.js frontend application.

## Implementation Steps

### 1. Backend Setup (Laravel 11)

#### 1.1 Create Laravel Project
```bash
cd backend
composer create-project laravel/laravel .
```

#### 1.2 Install Required Packages
- **laravel/sanctum** - API authentication
- **spatie/laravel-permission** - Role-based permissions
- **barryvdh/laravel-dompdf** - PDF generation for reports
- **maatwebsite/excel** - Excel export for reports
- **propaganistas/laravel-phone** - Phone number validation

#### 1.3 Configure Database
- MySQL connection settings
- Create `tutoring_system` database

#### 1.4 Configure CORS
- Allow requests from `localhost:3000` (Next.js)
- Configure Sanctum stateful domains

#### 1.5 Setup Test Environment
- Configure SQLite for testing
- Setup PHPUnit with coverage

### 2. Frontend Setup (Next.js 14)

#### 2.1 Create Next.js Project
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

#### 2.2 Install Dependencies
- **axios** - HTTP client
- **@tanstack/react-query** - Data fetching and caching
- **zustand** - State management
- **react-hook-form** - Form handling
- **@hookform/resolvers** - Form validation resolvers
- **zod** - Schema validation
- **date-fns** - Date utilities
- **react-big-calendar** - Calendar component
- **recharts** - Charts for dashboard
- **@headlessui/react** - UI components
- **@heroicons/react** - Icons
- **clsx** - Class name utilities
- **tailwind-merge** - Tailwind class merging
- **react-hot-toast** - Toast notifications

#### 2.3 Setup Project Structure
- Create folder structure as per specification
- Setup API client with Axios
- Configure environment variables

### 3. Git & Documentation

#### 3.1 Create .gitignore Files
- Backend: Laravel defaults + IDE files
- Frontend: Next.js defaults + IDE files

#### 3.2 Create Documentation
- README.md with project overview
- CHECKLIST.md for progress tracking

#### 3.3 Initialize Repository
- Initial commit
- Push to GitHub

## File Structure After Phase 1

```
Tutoring-System/
├── backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── tests/
│   ├── .env
│   ├── .env.testing
│   ├── composer.json
│   └── phpunit.xml
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   ├── __tests__/
│   ├── .env.local
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── phase1-setup-plan.md
├── CHECKLIST.md
├── README.md
├── CLAUDE.md
└── .gitignore
```

## Verification Steps

1. Backend server starts: `php artisan serve`
2. Frontend server starts: `npm run dev`
3. Backend tests run: `php artisan test`
4. Frontend linting passes: `npm run lint`

## Configuration Details

### Backend .env
```env
APP_NAME="Tutoring System"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tutoring_system
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
QUEUE_CONNECTION=database
```

### Frontend .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME="Tutoring System"
```

---
Last Updated: 2024-12-19
