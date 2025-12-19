# Phase 2: Authentication System - Implementation Plan

## Overview
Implement a complete authentication system using Laravel Sanctum for the backend API and Next.js for the frontend with protected routes.

## Backend Implementation

### 1. Auth Controller
Located at `app/Http/Controllers/Api/AuthController.php`

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns token)
- `POST /api/auth/logout` - User logout (revokes token)
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get authenticated user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token

### 2. Request Validation Classes
- `RegisterRequest` - Validate registration data
- `LoginRequest` - Validate login credentials
- `UpdateProfileRequest` - Validate profile updates
- `ChangePasswordRequest` - Validate password change
- `ForgotPasswordRequest` - Validate forgot password
- `ResetPasswordRequest` - Validate password reset

### 3. API Resources
- `UserResource` - Transform user data for API responses

### 4. Tests
- Unit tests for User model
- Feature tests for all auth endpoints

## Frontend Implementation

### 1. Auth Pages (App Router)
- `src/app/(auth)/login/page.tsx` - Login form
- `src/app/(auth)/register/page.tsx` - Registration form
- `src/app/(auth)/forgot-password/page.tsx` - Forgot password form
- `src/app/(auth)/reset-password/page.tsx` - Reset password form
- `src/app/(auth)/layout.tsx` - Auth layout (centered cards)

### 2. Components
- `src/components/forms/LoginForm.tsx` - Login form component
- `src/components/forms/RegisterForm.tsx` - Registration form component
- `src/components/ui/Input.tsx` - Input component
- `src/components/ui/Alert.tsx` - Alert component

### 3. API Integration
- Update `src/hooks/useAuth.ts` with actual API calls
- Implement React Query providers

### 4. Tests
- Component tests for forms
- Integration tests for auth flow

## Authentication Flow

### Registration Flow
1. User fills registration form
2. Frontend validates with Zod
3. POST to `/api/auth/register`
4. Backend validates, creates user, returns token
5. Frontend stores token, redirects to dashboard

### Login Flow
1. User fills login form (phone + password)
2. Frontend validates with Zod
3. POST to `/api/auth/login`
4. Backend validates credentials, returns token
5. Frontend stores token, redirects to dashboard

### Protected Routes
1. Middleware checks for token in localStorage/cookies
2. If no token, redirect to login
3. If token exists, verify with `/api/auth/me`
4. If invalid, clear token and redirect to login

## Security Considerations
- Passwords hashed with bcrypt (12 rounds)
- Sanctum tokens with expiration
- CORS configured for frontend domain only
- Rate limiting on auth endpoints
- Input validation on all endpoints

---
Last Updated: 2025-12-19
