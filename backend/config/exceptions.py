from django.conf import settings
from django.db import DatabaseError
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        return response

    if settings.DEBUG:
        return None

    if isinstance(exc, DatabaseError):
        return Response({"detail": "A database error occurred."}, status=500)

    return Response({"detail": "Something went wrong."}, status=500)
