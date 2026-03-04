from rest_framework import serializers
from .models import Classfield

class ClassfieldSerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='owner.user.username')

    class Meta:
        model = Classfield
        ields = [
            'id',
            'title',
            'description',
            'price',
            'date',
            'photo',
            'category',
            'category_title',
            'owner',
            'owner_name',

        ]
        read_only_fields = ['owner', 'created_at']

    def validate_image(self, value):
        if value:
            limit_mb = 10 
            if value.size > limit_mb * 1024 * 1024:
                raise serializers.ValidationError(f"Максимальний розмір фото {limit_mb} МБ")
            if not value.name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                raise serializers.ValidationError("Дозволені формати: JPG, JPEG, PNG, WEBP")
        return value