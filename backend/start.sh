#!/usr/bin/env bash
# Exit on error
set -o errexit

# Apply any outstanding database migrations
python manage.py migrate

# Collect static files for the frontend (CSS/Images)
python manage.py collectstatic --noinput

# Start the server using Gunicorn
# Replace 'config.wsgi' with 'your_project_name.wsgi' if your project is named differently
gunicorn config.wsgi:application