# Contributing to Tutoring System

Thank you for your interest in contributing to the Tutoring System! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for everyone.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Tutoring-System.git
   cd Tutoring-System
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/Tutoring-System.git
   ```
4. **Install dependencies**:
   ```bash
   make install
   ```

## Development Setup

### Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 18+
- npm 9+
- MySQL 8.0+
- Redis (optional, for caching)

### Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database
mysql -u root -p -e "CREATE DATABASE tutoring_system"

# Run migrations
php artisan migrate

# Seed with demo data (optional)
php artisan db:seed

# Start development server
php artisan serve --port=8001
```

### Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm ci

# Copy environment file
cp .env.example .env.local

# Update API URL in .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8001/api

# Start development server
npm run dev
```

### Using Docker (Alternative)

```bash
# Copy Docker environment file
cp .env.docker.example .env.docker

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend php artisan migrate --seed
```

## Branch Naming Convention

Use descriptive branch names following this pattern:

```
<type>/<short-description>
```

### Types

| Type | Description |
|------|-------------|
| `feature` | New feature or enhancement |
| `fix` | Bug fix |
| `hotfix` | Urgent production fix |
| `refactor` | Code refactoring |
| `docs` | Documentation updates |
| `test` | Test additions or updates |
| `chore` | Maintenance tasks |

### Examples

```bash
feature/student-export-pdf
fix/payment-calculation-error
docs/api-documentation
refactor/session-service
test/attendance-api-tests
```

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |
| `build` | Build system or dependencies |

### Scope

Optional scope indicating the area affected:
- `backend`, `frontend`
- `api`, `ui`
- `auth`, `students`, `groups`, `sessions`, `payments`, `quizzes`, etc.

### Examples

```bash
feat(students): add bulk import functionality
fix(payments): correct monthly fee calculation
docs(api): update authentication endpoints
test(backend): add group API integration tests
refactor(frontend): simplify session scheduling component
chore: update dependencies
```

### Guidelines

- Use **imperative mood** ("add" not "added")
- Keep subject line under **72 characters**
- Don't end subject with a period
- Separate subject from body with a blank line
- Use body to explain **what** and **why**, not how

## Pull Request Process

### Before Submitting

1. **Update your fork** with the latest upstream changes:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make your changes** following coding standards

4. **Run tests** and ensure they pass:
   ```bash
   make test
   ```

5. **Run linters**:
   ```bash
   make lint
   ```

6. **Commit your changes** with proper commit messages

### Submitting

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature
   ```

2. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changes you made and why
   - Include screenshots for UI changes

### PR Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
- [ ] All existing tests pass
- [ ] Added new tests for new functionality
- [ ] Tested manually

## Screenshots (if applicable)
Add screenshots here.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my code
- [ ] Added comments for complex logic
- [ ] Updated documentation if needed
```

### Review Process

1. At least one maintainer must approve your PR
2. All CI checks must pass
3. Resolve any requested changes
4. Squash commits if requested

## Coding Standards

### PHP (Backend)

- Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) coding standard
- Use [Laravel Pint](https://laravel.com/docs/11.x/pint) for formatting
- Type hints required for parameters and return types
- PHPDoc blocks for public methods

```php
/**
 * Get students with pagination.
 *
 * @param int $perPage
 * @return LengthAwarePaginator<Student>
 */
public function getStudents(int $perPage = 15): LengthAwarePaginator
{
    return Student::query()
        ->with(['groups', 'payments'])
        ->orderBy('name')
        ->paginate($perPage);
}
```

### TypeScript (Frontend)

- Use TypeScript strict mode
- Follow [ESLint](https://eslint.org/) rules
- Prefer functional components with hooks
- Use proper typing, avoid `any`

```typescript
interface StudentCardProps {
  student: Student;
  onEdit: (id: number) => void;
}

export function StudentCard({ student, onEdit }: StudentCardProps) {
  return (
    <div className="card">
      <h3>{student.name}</h3>
      <button onClick={() => onEdit(student.id)}>Edit</button>
    </div>
  );
}
```

### General Guidelines

- Keep functions small and focused
- Use meaningful variable and function names
- Avoid magic numbers; use constants
- Write self-documenting code
- Add comments only when necessary

## Testing Requirements

### Backend

- **100% test coverage required**
- Write unit tests for models and services
- Write feature tests for API endpoints
- Use factories for test data

```bash
# Run tests with coverage
php artisan test --coverage

# Run specific test
php artisan test --filter=StudentApiTest
```

### Frontend

- Write tests for components and hooks
- Use React Testing Library
- Test user interactions and edge cases

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

### E2E Tests

- Write Playwright tests for critical user flows
- Test across different browsers

```bash
# Run E2E tests
npm run test:e2e
```

## Questions?

If you have questions about contributing, please:

1. Check existing issues and documentation
2. Open a new issue with the `question` label
3. Be specific about what you need help with

Thank you for contributing!
