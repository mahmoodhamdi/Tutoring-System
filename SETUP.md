# Tutoring System - Setup Guide

## Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

---

## Step 1: Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE tutoring_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Step 2: Backend Setup

Open PowerShell and run:

```powershell
# Navigate to backend
cd D:\Tutoring-System\backend

# Install PHP dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed demo data (optional but recommended)
php artisan db:seed

# Start server
php artisan serve
```

Backend will be available at: http://localhost:8000

---

## Step 3: Frontend Setup

Open another PowerShell window and run:

```powershell
# Navigate to frontend
cd D:\Tutoring-System\frontend

# Install Node dependencies
npm install

# Copy environment file
copy .env.example .env.local

# Start dev server
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## Step 4: Configure Environment

### Backend (.env)
Make sure these are set correctly:
```env
DB_DATABASE=tutoring_system
DB_USERNAME=root
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Demo Login Credentials

After running `php artisan db:seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Teacher | teacher@example.com | password |
| Student | student0@example.com | password |
| Parent | parent0@example.com | password |

---

## Quick Start Commands

### Terminal 1 (Backend):
```powershell
cd D:\Tutoring-System\backend && php artisan serve
```

### Terminal 2 (Frontend):
```powershell
cd D:\Tutoring-System\frontend && npm run dev
```

---

## Troubleshooting

### CORS Issues
Make sure `SANCTUM_STATEFUL_DOMAINS` includes `localhost:3000`

### Database Connection
Check MySQL is running and credentials in `.env` are correct

### API Not Working
1. Check backend is running on port 8000
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
