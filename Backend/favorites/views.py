from rest_framework import viewsets
from .models import Favorite
from .serializers import FavoriteSerializer
from .pagination import FavoritePagination
from users.models import UserClassfield

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    pagination_class = FavoritePagination

    def get_queryset(self):
        # Фільтр: /api/favorites/?user=3
        user_id = self.request.query_params.get('user')
        if user_id:
            return Favorite.objects.filter(user=user_id).order_by('-id')
        return Favorite.objects.all().order_by('-id')

    def perform_create(self, serializer):
        try:
            user = UserClassfield.objects.first()
            serializer.save(user=user)
        except:
            serializer.save()