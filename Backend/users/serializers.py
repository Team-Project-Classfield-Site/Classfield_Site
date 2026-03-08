from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserClassfield


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(required=True, min_length=13, max_length=20)
    avatar = serializers.ImageField(required=False, allow_null=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "phone", "avatar")
        
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Користувач з таким email вже існує.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Користувач з таким username вже існує.")
        return value

    def validate_phone(self, value):
        if value and UserClassfield.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Цей номер телефону вже використовується.")
        return value

    

    def create(self, validated_data):
        phone = validated_data.pop("phone", "")
        avatar = validated_data.pop("avatar", None)
        
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )

        UserClassfield.objects.create(user=user, phone=phone, avatar=avatar)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    email = serializers.CharField(source="user.email")

    class Meta:
        model = UserClassfield
        fields = ("username", "email", "phone", "avatar")