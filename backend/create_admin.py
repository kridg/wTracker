import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from accounts.models import User


def create_superuser():
    username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
    email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

    if not all([username, email, password]):
        print("Skipping superuser create: set DJANGO_SUPERUSER_USERNAME, EMAIL, and PASSWORD.")
        return

    if User.objects.filter(username=username).exists():
        print("Superuser already exists.")
        return

    User.objects.create_superuser(username, email, password)
    print("Superuser created.")


if __name__ == "__main__":
    create_superuser()
