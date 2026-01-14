# backend/create_admin.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User # Adjust if your user model is elsewhere

def create_superuser():
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'yourpassword123')
        print("Superuser created!")
    else:
        print("Superuser already exists.")

if __name__ == "__main__":
    create_superuser()