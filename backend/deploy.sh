#!/bin/bash

# Tutoring System Backend Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
echo "Deploying to $ENVIRONMENT environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env exists
if [ ! -f .env ]; then
    log_error ".env file not found! Please create it from .env.production"
    exit 1
fi

# Enable maintenance mode
log_info "Enabling maintenance mode..."
php artisan down --render="errors::503" --retry=60 || true

# Pull latest changes (if using git)
if [ -d .git ]; then
    log_info "Pulling latest changes..."
    git pull origin main
fi

# Install/update dependencies
log_info "Installing dependencies..."
composer install --no-dev --optimize-autoloader

# Clear all caches
log_info "Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run database migrations
log_info "Running database migrations..."
php artisan migrate --force

# Optimize for production
log_info "Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Set proper permissions
log_info "Setting permissions..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# Restart queue workers (if using queues)
log_info "Restarting queue workers..."
php artisan queue:restart || true

# Disable maintenance mode
log_info "Disabling maintenance mode..."
php artisan up

log_info "Deployment completed successfully!"
echo ""
echo "Post-deployment checklist:"
echo "  1. Verify the application is running: curl -I ${APP_URL:-your-domain.com}/api/health"
echo "  2. Check logs for errors: tail -f storage/logs/laravel.log"
echo "  3. Run tests if needed: php artisan test"
