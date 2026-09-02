# Base image specified in course materials
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install PostgreSQL client dependencies
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Layer cache optimization: install dependencies before copying app source
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Collect static files for WhiteNoise
RUN python manage.py collectstatic --noinput

# Security best practice: create and switch to a non-root user
RUN adduser --disabled-password --gecos '' appuser
USER appuser

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]