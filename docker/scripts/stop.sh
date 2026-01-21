#!/bin/bash
# Stop Docker containers

set -e

echo "Stopping Tutoring System Docker containers..."

docker-compose down

echo "All containers stopped."
