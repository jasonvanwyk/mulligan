#!/bin/sh
# entrypoint.sh

set -e

# Wait for the database to be ready
./docker/backend/wait-for-it.sh db

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Start the server
echo "Starting the server..."
exec python manage.py runserver 0.0.0.0:8000 