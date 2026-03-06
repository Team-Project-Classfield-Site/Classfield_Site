from rest_framework import viewsets, permissions
from rest_framework.permissions import AllowAny
from .models import Classfield
from .serializers import ClassfieldSerializer
from .pagination import ClassfieldPagination
from .permissions import IsOwnerOrReadOnly 
from users.models import UserClassfield
from rest_framework import viewsets, permissions, filters

class ClassfieldViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]

    queryset = Classfield.objects.all().order_by('-date')
    serializer_class = ClassfieldSerializer
    pagination_class = ClassfieldPagination
    
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    filter_backends = [filters.SearchFilter]
    search_fields = ['title']

    def perform_create(self, serializer):
        user_profile = UserClassfield.objects.get(user=self.request.user)
        
        serializer.save(owner=user_profile)