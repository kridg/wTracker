from django.contrib.auth import get_user_model
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .cookies import REFRESH_COOKIE, clear_auth_cookies, set_auth_cookies
from .serializers import MeSerializer, RegisterSerializer
from .throttles import LoginRateThrottle, RegisterRateThrottle

User = get_user_model()


def enforce_csrf(request):
    SessionAuthentication().enforce_csrf(request)


class CsrfTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"csrfToken": get_token(request)})


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [RegisterRateThrottle]

    def post(self, request):
        enforce_csrf(request)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CookieTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [LoginRateThrottle]

    def post(self, request, *args, **kwargs):
        enforce_csrf(request)
        response = super().post(request, *args, **kwargs)
        if response.status_code != 200:
            return response

        access = response.data.get("access")
        refresh = response.data.get("refresh")
        user = User.objects.filter(username=request.data.get("username")).first()
        body = MeSerializer(user).data if user else {}
        cookie_response = Response(body, status=status.HTTP_200_OK)
        set_auth_cookies(cookie_response, access=access, refresh=refresh)
        return cookie_response


class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        enforce_csrf(request)
        refresh = request.COOKIES.get(REFRESH_COOKIE)
        if not refresh:
            return Response(
                {"detail": "Refresh token missing."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(data={"refresh": refresh})
        try:
            serializer.is_valid(raise_exception=True)
        except (TokenError, InvalidToken):
            failed = Response(
                {"detail": "Session expired. Please log in again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            clear_auth_cookies(failed)
            return failed

        data = serializer.validated_data
        cookie_response = Response({"detail": "Token refreshed."}, status=status.HTTP_200_OK)
        set_auth_cookies(
            cookie_response,
            access=data.get("access"),
            refresh=data.get("refresh"),
        )
        return cookie_response


class LogoutView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        enforce_csrf(request)
        refresh = request.COOKIES.get(REFRESH_COOKIE)
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except (TokenError, InvalidToken):
                pass
        response = Response({"detail": "Logged out."}, status=status.HTTP_200_OK)
        clear_auth_cookies(response)
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(MeSerializer(request.user).data)
