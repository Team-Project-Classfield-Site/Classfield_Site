from rest_framework import viewsets
from .models import Comment
from .serializers import CommentSerializer
from .pagination import CommentPagination
from users.models import UserClassfield

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    def get_queryset(self):
        # Фільтр: /api/comments/?classfield=5
        classfield_id = self.request.query_params.get('classfield')
        if classfield_id:
            return Comment.objects.filter(classfield=classfield_id).order_by('-id')
        return Comment.objects.all().order_by('-id')

    def perform_create(self, serializer):
        try:
            author = UserClassfield.objects.first()  # заглушка як у classfields
            serializer.save(author=author)
        except:
            serializer.save()