from rest_framework import viewsets, permissions, filters
from .models import Classfield
from .serializers import ClassfieldSerializer
from .permissions import IsOwnerOrReadOnly
from comments.models import Comment
from comments.serializers import CommentSerializer
from classfields.serializers import ClassfieldSerializer 
from users.models import UserClassfield
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
import django_filters

class ClassfieldFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')

    class Meta:
        model = Classfield
        fields = ['category', 'min_price', 'max_price']


class ClassfieldViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [filters.SearchFilter]
    search_fields = ['title']

    queryset = Classfield.objects.all().order_by('-date')
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

    def perform_create(self, serializer):
        user_profile, _created = UserClassfield.objects.get_or_create(user=self.request.user)

        serializer.save(owner=user_profile)
