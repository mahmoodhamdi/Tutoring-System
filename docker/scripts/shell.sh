#!/bin/bash
# Open shell in backend container

CONTAINER=${1:-backend}

echo "Opening shell in $CONTAINER container..."
docker-compose exec $CONTAINER sh
