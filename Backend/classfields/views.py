from rest_framework import viewsets, permissions
from .models import Classfield
from .serializers import ClassfieldSerializer
from .pagination import ClassfieldPagination
from .permissions import IsOwnerOrReadOnly 
from users.models import UserClassfield

class ClassfieldViewSet(viewsets.ModelViewSet):
    queryset = Classfield.objects.all().order_by('-date')
    serializer_class = ClassfieldSerializer
    pagination_class = ClassfieldPagination
    
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        user_profile = UserClassfield.objects.get(user=self.request.user)
        
        serializer.save(owner=user_profile)