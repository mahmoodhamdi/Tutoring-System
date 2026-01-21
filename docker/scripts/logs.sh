#!/bin/bash
# View Docker container logs

SERVICE=${1:-""}

if [ -n "$SERVICE" ]; then
    echo "Viewing logs for $SERVICE..."
    docker-compose logs -f $SERVICE
else
    echo "Viewing all container logs..."
    docker-compose logs -f
fi
