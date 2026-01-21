# Tutoring Management System

[![Backend CI](https://github.com/YOUR_USERNAME/Tutoring-System/actions/workflows/backend.yml/badge.svg)](https://github.com/YOUR_USERNAME/Tutoring-System/actions/workflows/backend.yml)
[![Frontend CI](https://github.com/YOUR_USERNAME/Tutoring-System/actions/workflows/frontend.yml/badge.svg)](https://github.com/YOUR_USERNAME/Tutoring-System/actions/workflows/frontend.yml)
[![E2E Tests](https://github.com/YOUR_USERNAME/Tutoring-System/actions/workflows/e2e.yml/badge.svg)](https://github.com/YOUR_USERNAME/Tutoring-System/actions/workflows/e2e.yml)

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
- **Cache:** Redis
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
- **E2E Testing:** Playwright

## Quick Start

### Using Make (Recommended)

```bash
# Install all dependencies
make install

# Start development servers
make dev
```

This will start:
- Backend API at `http://localhost:8001`
- Frontend at `http://localhost:3000`

### Using Docker

```bash
# Copy environment file
cp .env.docker.example .env.docker

# Start all services
make docker-up

# Run migrations
make docker-migrate

# Seed database
make docker-seed
```

Docker services:
- Frontend: `http://localhost:3000`
- API: `http://localhost/api`
- MySQL: `localhost:3306`
- Redis: `localhost:6379`

See [Docker Setup](#docker-setup) for more details.

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
│   ├── e2e/                # Playwright E2E tests
│   └── __tests__/          # Unit tests
├── docker/                  # Docker configuration
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
├── .github/workflows/       # CI/CD pipelines
├── Makefile                # Common commands
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 18+
- npm 9+
- MySQL 8.0+
- Redis (optional, for caching)

## Manual Installation

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
php artisan serve --port=8001
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm ci

# Copy environment file
cp .env.example .env.local

# Configure API URL in .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8001/api

# Start development server
npm run dev
```

## Docker Setup

### Prerequisites
- Docker 20+
- Docker Compose 2+

### Configuration

1. Copy the Docker environment file:
   ```bash
   cp .env.docker.example .env.docker
   ```

2. Update the environment variables in `.env.docker`

### Starting Services

```bash
# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Docker Commands

```bash
# Build images
make docker-build

# Run migrations
make docker-migrate

# Seed database
make docker-seed

# Fresh migrate and seed
make docker-fresh

# Open shell in backend container
make docker-shell

# Run artisan commands
docker-compose exec backend php artisan <command>
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| nginx | 80, 443 | Web server & reverse proxy |
| backend | 9000 | Laravel PHP-FPM |
| frontend | 3000 | Next.js application |
| mysql | 3306 | MySQL database |
| redis | 6379 | Redis cache |
| queue | - | Laravel queue worker |
| scheduler | - | Laravel scheduler |

## Development

### Available Commands

```bash
# Show all available commands
make help

# Install dependencies
make install

# Start development servers
make dev

# Run all tests
make test

# Run linters
make lint

# Fresh database
make fresh
```

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

**E2E Tests:**
```bash
cd frontend
npm run test:e2e          # Run Playwright tests
npm run test:e2e:ui       # Run with UI
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
npm run type-check        # TypeScript check
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment.

### Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `backend.yml` | Push to backend/ | Run PHP tests, Pint, PHPStan |
| `frontend.yml` | Push to frontend/ | Run lint, type-check, tests, build |
| `e2e.yml` | Push to main | Run Playwright E2E tests |
| `deploy.yml` | Push to main | Deploy to production |

### Status Badges

See the badges at the top of this README for current CI status.

## API Documentation

The API follows RESTful conventions. Full documentation is available at `/api/documentation` when running the application.

### Main Endpoints

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
APP_URL=http://localhost:8001

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tutoring_system
DB_USERNAME=root
DB_PASSWORD=

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_APP_NAME="Tutoring System"
```

## Deployment

For production deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

The deployment guide covers:
- Server requirements and setup
- SSL configuration with Let's Encrypt
- Nginx configuration
- Queue workers with Supervisor
- PM2 process management
- Backup strategies
- Security hardening
- Monitoring and logging
- Troubleshooting

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Setting up your development environment
- Branch naming conventions
- Commit message format
- Pull request process
- Coding standards
- Testing requirements

## License

This project is licensed under the MIT License.

## Support

For support:
- Open an issue in the GitHub repository
- Check existing issues and documentation
- See [docs/](docs/) for additional documentation
