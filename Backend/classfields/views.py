from rest_framework import viewsets, permissions
from .models import Classfield
from .serializers import ClassfieldSerializer
from .pagination import ClassfieldPagination
from rest_framework.exceptions import ValidationError
from users.models import UserClassfield

class ClassfieldViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    queryset = Classfield.objects.all().order_by('-date')
    serializer_class = ClassfieldSerializer
    pagination_class = ClassfieldPagination

    def perform_create(self, serializer):
        user_profile, created = UserClassfield.objects.get_or_create(user=self.request.user)

        serializer.save(owner=user_profile)