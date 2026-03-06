from rest_framework import viewsets, permissions
from .models import Classfield
from .serializers import ClassfieldSerializer
from .pagination import ClassfieldPagination
from rest_framework.exceptions import ValidationError
from .permissions import IsOwnerOrReadOnly 
from users.models import UserClassfield
from rest_framework import viewsets, permissions, filters

class ClassfieldViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    queryset = Classfield.objects.all().order_by('-date')
    serializer_class = ClassfieldSerializer
    pagination_class = ClassfieldPagination

    def perform_create(self, serializer):
        user_profile, created_ = UserClassfield.objects.get_or_create(user=self.request.user)

        serializer.save(owner=user_profile)