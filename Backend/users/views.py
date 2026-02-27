from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserProfileSerializer
from .models import UserClassfield


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "message": "Реєстрація успішна.",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username_or_email = request.data.get("username")
        password = request.data.get("password")

        if not username_or_email or not password:
            return Response(
                {"error": "Введіть username/email та пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Пошук по username або email
        user = None
        if "@" in username_or_email:
            try:
                db_user = User.objects.get(email=username_or_email)
                if db_user.check_password(password):
                    user = db_user
            except User.DoesNotExist:
                pass
        else:
            try:
                db_user = User.objects.get(username=username_or_email)
                if db_user.check_password(password):
                    user = db_user
            except User.DoesNotExist:
                pass

        if user is None:
            return Response(
                {"error": "Невірний логін або пароль."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Refresh токен обов'язковий."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Успішний вихід."}, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {"error": "Невалідний токен."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = UserClassfield.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserClassfield.DoesNotExist:
            return Response({"error": "Профіль не знайдено."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        try:
            profile = UserClassfield.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserClassfield.DoesNotExist:
            return Response({"error": "Профіль не знайдено."}, status=status.HTTP_404_NOT_FOUND)