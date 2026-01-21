#!/bin/bash
# Run artisan commands

set -e

if [ -z "$1" ]; then
    echo "Usage: ./artisan.sh <command>"
    echo "Example: ./artisan.sh cache:clear"
    exit 1
fi

docker-compose exec backend php artisan "$@"
