from rest_framework import serializers
from .models import Classfield

class ClassfieldSerializer(serializers.ModelSerializer):
    category_title = serializers.SerializerMethodField(read_only=True)
    owner_name = serializers.SerializerMethodField(read_only=True)
    owner_avatar = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Classfield
        fields = [
            'id',
            'title',
            'description',
            'price',
            'date',
            'photo',
            'premiumtag',
            'category',
            'category_title',
            'owner',
            'owner_name',
            'owner_avatar',
        ]
        
        read_only_fields = ['owner', 'date']

    def validate_image(self, value):
        if value:
            limit_mb = 10 
            if value.size > limit_mb * 1024 * 1024:
                raise serializers.ValidationError(f"Максимальний розмір фото {limit_mb} МБ")
            if not value.name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                raise serializers.ValidationError("Дозволені формати: JPG, JPEG, PNG, WEBP")
        return value


    def get_category_title(self, obj):
        if obj.category:

            return getattr(obj.category, 'name', getattr(obj.category, 'title', str(obj.category)))
        return None

    def get_owner_name(self, obj):
        """Return the owner's username."""
        return obj.owner.user.username if obj.owner else None
    
    def get_owner_avatar(self, obj):
        if obj.owner and hasattr(obj.owner, 'avatar') and obj.owner.avatar:
            return obj.owner.avatar.url
        return None
