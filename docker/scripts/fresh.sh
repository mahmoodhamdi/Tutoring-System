#!/bin/bash
# Fresh migrate with seeding

set -e

echo "Warning: This will drop all tables and re-run migrations!"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running fresh migration with seed..."
    docker-compose exec backend php artisan migrate:fresh --seed --force
    echo "Database has been refreshed."
else
    echo "Operation cancelled."
fi
