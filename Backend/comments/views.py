from rest_framework import viewsets, permissions
from .models import Comment
from .serializers import CommentSerializer
from .pagination import CommentPagination
from users.models import UserClassfield

class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    def get_queryset(self):
        classfield_id = self.request.query_params.get('classfield')
        queryset = Comment.objects.all().order_by('-id')
        
        if classfield_id:
            queryset = queryset.filter(classfield_id=classfield_id)
            
        return queryset

    def perform_create(self, serializer):
        author_profile, _created = UserClassfield.objects.get_or_create(user=self.request.user)
        
        serializer.save(author=author_profile)