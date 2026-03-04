from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from .models import Classfield
from .serializers import ClassfieldSerializer
from .permissions import IsOwnerOrReadOnly
from comments.models import Comment
from comments.serializers import CommentSerializer

class ClassfieldFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')

    class Meta:
        model = Classfield
        fields = ['category', 'min_price', 'max_price']

class ClassfieldViewSet(viewsets.ModelViewSet):
    queryset = Classfield.objects.all()
    serializer_class = ClassfieldSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    
    filterset_class = ClassfieldFilter
    
    ordering_fields = ['price', 'created_at']
    
    search_fields = ['title', 'description']

  
    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def comments(self, request, pk=None):
        classfield = self.get_object()
        comments = Comment.objects.filter(classfield=classfield).order_by('-created_at')
        
        page = self.paginate_queryset(comments)
        if page is not None:
            serializer = CommentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)