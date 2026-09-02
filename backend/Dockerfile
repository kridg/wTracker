# Accept dynamic version from matrix, default to 3.12
ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim

WORKDIR /app

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set DJANGO_DEBUG=True so settings.py uses the dev fallback key and skips ALLOWED_HOSTS checks during build
RUN DJANGO_DEBUG=True python manage.py collectstatic --noinput

RUN adduser --disabled-password --gecos '' appuser
USER appuser

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]