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

    def get_category_title(self, obj):
        """Return the category title if it exists."""
        return obj.category.title if obj.category else None

    def get_owner_name(self, obj):
        """Return the owner's username."""
        return obj.owner.user.username if obj.owner else None
    
    def get_owner_avatar(self, obj):
            if obj.owner and obj.owner.avatar:
                return obj.owner.avatar.url
            return None