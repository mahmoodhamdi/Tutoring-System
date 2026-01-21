# =============================================================================
# Tutoring System - Makefile
# =============================================================================
# Common commands for development, testing, and deployment
# Usage: make <target>
# =============================================================================

.PHONY: help install dev test build clean docker-up docker-down docker-logs \
        backend-install backend-dev backend-test backend-lint backend-migrate \
        frontend-install frontend-dev frontend-test frontend-lint frontend-build \
        fresh seed coverage e2e

# Default target
help:
	@echo "Tutoring System - Available Commands"
	@echo "====================================="
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install          Install all dependencies (backend + frontend)"
	@echo "  make backend-install  Install backend dependencies only"
	@echo "  make frontend-install Install frontend dependencies only"
	@echo ""
	@echo "Development:"
	@echo "  make dev              Start both backend and frontend dev servers"
	@echo "  make backend-dev      Start backend development server (port 8001)"
	@echo "  make frontend-dev     Start frontend development server (port 3000)"
	@echo ""
	@echo "Testing:"
	@echo "  make test             Run all tests (backend + frontend)"
	@echo "  make backend-test     Run backend tests with coverage"
	@echo "  make frontend-test    Run frontend tests"
	@echo "  make e2e              Run E2E tests with Playwright"
	@echo "  make coverage         Generate coverage reports"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint             Run all linters"
	@echo "  make backend-lint     Run Laravel Pint (PHP)"
	@echo "  make frontend-lint    Run ESLint (TypeScript)"
	@echo ""
	@echo "Database:"
	@echo "  make migrate          Run database migrations"
	@echo "  make seed             Seed database with sample data"
	@echo "  make fresh            Fresh migrate and seed"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up        Start Docker containers"
	@echo "  make docker-down      Stop Docker containers"
	@echo "  make docker-build     Build Docker images"
	@echo "  make docker-logs      View Docker logs"
	@echo "  make docker-shell     Open shell in backend container"
	@echo ""
	@echo "Build:"
	@echo "  make build            Build for production"
	@echo "  make frontend-build   Build frontend only"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean            Remove generated files and caches"

# =============================================================================
# Installation
# =============================================================================

install: backend-install frontend-install
	@echo "All dependencies installed successfully!"

backend-install:
	@echo "Installing backend dependencies..."
	cd backend && composer install
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		cd backend && php artisan key:generate; \
	fi

frontend-install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm ci
	@if [ ! -f frontend/.env.local ]; then \
		cp frontend/.env.example frontend/.env.local 2>/dev/null || true; \
	fi

# =============================================================================
# Development
# =============================================================================

dev:
	@echo "Starting development servers..."
	@echo "Backend: http://localhost:8001"
	@echo "Frontend: http://localhost:3000"
	@make -j2 backend-dev frontend-dev

backend-dev:
	cd backend && php artisan serve --port=8001

frontend-dev:
	cd frontend && npm run dev

# =============================================================================
# Testing
# =============================================================================

test: backend-test frontend-test
	@echo "All tests completed!"

backend-test:
	@echo "Running backend tests..."
	cd backend && php artisan test --coverage

frontend-test:
	@echo "Running frontend tests..."
	cd frontend && npm run test

e2e:
	@echo "Running E2E tests..."
	cd frontend && npm run test:e2e

coverage:
	@echo "Generating coverage reports..."
	cd backend && php artisan test --coverage-html=coverage
	cd frontend && npm run test:coverage
	@echo "Backend coverage: backend/coverage/index.html"
	@echo "Frontend coverage: frontend/coverage/lcov-report/index.html"

# =============================================================================
# Code Quality
# =============================================================================

lint: backend-lint frontend-lint
	@echo "All linting completed!"

backend-lint:
	@echo "Running Laravel Pint..."
	cd backend && ./vendor/bin/pint

frontend-lint:
	@echo "Running ESLint..."
	cd frontend && npm run lint -- --fix

type-check:
	@echo "Running TypeScript type check..."
	cd frontend && npm run type-check

# =============================================================================
# Database
# =============================================================================

migrate:
	@echo "Running migrations..."
	cd backend && php artisan migrate

seed:
	@echo "Seeding database..."
	cd backend && php artisan db:seed

fresh:
	@echo "Fresh migration and seed..."
	cd backend && php artisan migrate:fresh --seed

# =============================================================================
# Docker
# =============================================================================

docker-up:
	@echo "Starting Docker containers..."
	docker-compose up -d
	@echo "Services starting..."
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - API: http://localhost/api"
	@echo "  - MySQL: localhost:3306"
	@echo "  - Redis: localhost:6379"

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down

docker-build:
	@echo "Building Docker images..."
	docker-compose build --no-cache

docker-logs:
	docker-compose logs -f

docker-shell:
	docker-compose exec backend sh

docker-migrate:
	docker-compose exec backend php artisan migrate

docker-seed:
	docker-compose exec backend php artisan db:seed

docker-fresh:
	docker-compose exec backend php artisan migrate:fresh --seed

# =============================================================================
# Build
# =============================================================================

build: frontend-build
	@echo "Production build completed!"

frontend-build:
	@echo "Building frontend for production..."
	cd frontend && npm run build

# =============================================================================
# Cleanup
# =============================================================================

clean:
	@echo "Cleaning up..."
	rm -rf backend/vendor
	rm -rf backend/storage/logs/*.log
	rm -rf backend/bootstrap/cache/*.php
	rm -rf backend/coverage
	rm -rf frontend/node_modules
	rm -rf frontend/.next
	rm -rf frontend/coverage
	@echo "Cleanup completed!"

cache-clear:
	@echo "Clearing caches..."
	cd backend && php artisan cache:clear
	cd backend && php artisan config:clear
	cd backend && php artisan route:clear
	cd backend && php artisan view:clear
	@echo "Caches cleared!"
