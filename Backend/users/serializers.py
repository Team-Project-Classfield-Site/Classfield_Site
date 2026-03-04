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