#!/bin/bash

# Tutoring System Frontend Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
echo "Building for $ENVIRONMENT environment..."

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

# Check if .env.local exists
if [ ! -f .env.local ]; then
    log_warn ".env.local not found. Using .env.production..."
    cp .env.production .env.local
fi

# Clean previous build
log_info "Cleaning previous build..."
rm -rf .next out

# Install dependencies
log_info "Installing dependencies..."
npm ci

# Run linting
log_info "Running linter..."
npm run lint || {
    log_error "Linting failed. Please fix errors before deploying."
    exit 1
}

# Run type checking
log_info "Running type check..."
npm run build || {
    log_error "Build failed. Please check for errors."
    exit 1
}

log_info "Build completed successfully!"

echo ""
echo "Deployment options:"
echo "  1. For Vercel: vercel deploy --prod"
echo "  2. For Node.js: npm start"
echo "  3. For static export: npm run build && next export"
echo ""
echo "To start the production server locally:"
echo "  npm start"
