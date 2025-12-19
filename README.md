# Tutoring Management System

A comprehensive Private Tutoring Management System for teachers giving private lessons. The system manages students, groups, sessions, attendance, payments, quizzes, announcements, and exam schedules.

## Features

- **Student Management** - Track student information, profiles, and academic progress
- **Group Management** - Organize students into groups by subject and grade level
- **Session Scheduling** - Calendar-based session management with recurring templates
- **Attendance Tracking** - Mark and track attendance with detailed reports
- **Payment Management** - Monthly fees, payment tracking, and financial reports
- **Exams & Grades** - Schedule exams and record student grades
- **Online Quizzes** - Create interactive quizzes with multiple question types
- **Announcements** - Broadcast announcements to students and parents
- **Notifications** - Real-time notifications for important events
- **Dashboard & Reports** - Comprehensive analytics and exportable reports
- **Student/Parent Portal** - Dedicated portal for students and parents to view their information

## Tech Stack

### Backend
- **Framework:** Laravel 11
- **Authentication:** Laravel Sanctum
- **Database:** MySQL
- **PDF Generation:** DomPDF
- **Excel Export:** Maatwebsite Excel
- **Permissions:** Spatie Laravel Permission

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query
- **Forms:** React Hook Form + Zod
- **UI Components:** Headless UI + Heroicons

## Project Structure

```
Tutoring-System/
├── backend/                 # Laravel 11 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Enums/
│   ├── config/
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── tests/
├── frontend/                # Next.js 14 App
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   ├── store/          # Zustand stores
│   │   └── types/          # TypeScript types
│   └── __tests__/
├── docs/                    # Documentation
├── CHECKLIST.md            # Development progress
├── CLAUDE.md               # Claude Code instructions
└── README.md
```

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn
- MySQL 8.0+

## Installation

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=tutoring_system
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed

# Start development server
php artisan serve
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Configure API URL in .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

## Development

### Running Tests

**Backend:**
```bash
cd backend
php artisan test                    # Run all tests
php artisan test --coverage         # Run with coverage
php artisan test --filter=TestName  # Run specific test
```

**Frontend:**
```bash
cd frontend
npm run test              # Run all tests
npm run test:watch        # Run in watch mode
npm run test:coverage     # Run with coverage
```

### Code Quality

**Backend:**
```bash
cd backend
./vendor/bin/pint         # Fix code style
```

**Frontend:**
```bash
cd frontend
npm run lint              # Run ESLint
npm run lint -- --fix     # Fix linting issues
```

## API Documentation

The API follows RESTful conventions with the following main endpoints:

- `/api/auth/*` - Authentication (login, register, logout)
- `/api/students/*` - Student management
- `/api/groups/*` - Group management
- `/api/sessions/*` - Session scheduling
- `/api/attendance/*` - Attendance tracking
- `/api/payments/*` - Payment management
- `/api/exams/*` - Exam management
- `/api/quizzes/*` - Quiz management
- `/api/announcements/*` - Announcements
- `/api/notifications/*` - Notifications
- `/api/dashboard/*` - Dashboard statistics
- `/api/reports/*` - Report generation
- `/api/portal/*` - Student/Parent portal
- `/api/settings/*` - System settings

## Environment Variables

### Backend (.env)
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
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME="Tutoring System"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
