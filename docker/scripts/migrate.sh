#!/bin/bash
# Run database migrations

set -e

echo "Running database migrations..."
docker-compose exec backend php artisan migrate --force

echo "Migrations completed successfully."
