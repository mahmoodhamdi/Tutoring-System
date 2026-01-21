#!/bin/bash
# Start Docker containers

set -e

echo "Starting Tutoring System Docker containers..."

# Check if .env.docker exists
if [ ! -f ".env.docker" ]; then
    echo "Error: .env.docker file not found!"
    echo "Please copy .env.docker.example to .env.docker and configure it."
    exit 1
fi

# Build and start containers
docker-compose --env-file .env.docker up -d --build

echo ""
echo "Waiting for services to be ready..."
sleep 10

# Check health
echo ""
echo "Checking service health..."
docker-compose ps

echo ""
echo "Tutoring System is now running!"
echo "  - Frontend: http://localhost"
echo "  - API:      http://localhost/api"
echo "  - API Docs: http://localhost/api/documentation"
echo ""
echo "Use 'docker/scripts/logs.sh' to view logs"
