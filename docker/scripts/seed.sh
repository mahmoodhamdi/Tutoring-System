#!/bin/bash
# Run database seeders

set -e

echo "Running database seeders..."
docker-compose exec backend php artisan db:seed --force

echo "Seeding completed successfully."
