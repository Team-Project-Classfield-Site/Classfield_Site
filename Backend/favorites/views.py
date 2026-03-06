from .models import Favorite
from .serializers import FavoriteSerializer
from .pagination import FavoritePagination
from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from users.models import UserClassfield 

class FavoriteViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FavoriteSerializer
    pagination_class = FavoritePagination

    def get_queryset(self):
        try:
            user_profile = self.request.user.userclassfield
            queryset = Favorite.objects.filter(user=user_profile)
        except UserClassfield.DoesNotExist:
            return Favorite.objects.none()

        classfield_id = self.request.query_params.get('classfield')
        if classfield_id:
            queryset = queryset.filter(classfield_id=classfield_id)

        return queryset.order_by('-id')

    def perform_create(self, serializer):
        classfield = serializer.validated_data.get('classfield')
        
        user_profile, created = UserClassfield.objects.get_or_create(user=self.request.user)
        
        if Favorite.objects.filter(user=user_profile, classfield=classfield).exists():
            raise ValidationError({"detail": "Це оголошення вже в обраному."})

        serializer.save(user=user_profile)