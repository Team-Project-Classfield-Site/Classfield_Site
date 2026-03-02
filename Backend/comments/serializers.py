from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField(read_only=True)
    author_avatar = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 
            'text', 
            'author', 
            'classfield',
            'author_name',
            'author_avatar'
            ]
        read_only_fields = ['author']

    def get_author_name(self, obj):
        """Return the author's username."""
        return obj.author.user.username if obj.author else None
    
    def get_author_avatar(self, obj):
            if obj.author and obj.author.avatar:
                return obj.author.avatar.url
            return None