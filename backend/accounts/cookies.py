from django.conf import settings


ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"


def _cookie_kwargs(max_age, path):
    return {
        "httponly": True,
        "secure": settings.JWT_COOKIE_SECURE,
        "samesite": settings.JWT_COOKIE_SAMESITE,
        "max_age": max_age,
        "path": path,
    }


def set_auth_cookies(response, access=None, refresh=None):
    if access:
        response.set_cookie(
            ACCESS_COOKIE,
            access,
            **_cookie_kwargs(
                int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
                "/api/",
            ),
        )
    if refresh:
        response.set_cookie(
            REFRESH_COOKIE,
            refresh,
            **_cookie_kwargs(
                int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
                "/api/auth/",
            ),
        )
    return response


def clear_auth_cookies(response):
    response.delete_cookie(
        ACCESS_COOKIE,
        path="/api/",
        samesite=settings.JWT_COOKIE_SAMESITE,
    )
    response.delete_cookie(
        REFRESH_COOKIE,
        path="/api/auth/",
        samesite=settings.JWT_COOKIE_SAMESITE,
    )
    return response
