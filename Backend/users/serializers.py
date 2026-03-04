from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserClassfield
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserClassfieldSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = UserClassfield
        fields = ['id', 'user', 'avatar', 'phone']

    def validate_avatar(self, value):
        if value:
            limit_mb = 5
            if value.size > limit_mb * 1024 * 1024:
                raise serializers.ValidationError(f"Максимальний розмір файлу {limit_mb} МБ")
            if not value.name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                raise serializers.ValidationError("Дозволені формати: JPG, JPEG, PNG, WEBP")
        return value

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(required=False, allow_blank=True)
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "phone", "avatar")
        
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Користувач з таким email вже існує.")
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

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.save()

        if user_data:
            user = instance.user
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()

        return instance