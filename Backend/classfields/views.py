from rest_framework import viewsets, permissions
from .models import Classfield
from .serializers import ClassfieldSerializer
from .pagination import ClassfieldPagination
from users.models import UserClassfield

class ClassfieldViewSet(viewsets.ModelViewSet):
    queryset = Classfield.objects.all().order_by('-date')
    serializer_class = ClassfieldSerializer
    pagination_class = ClassfieldPagination
    # permissions_classes = [permissions.IsAuthenticatedOrReadOnly] # Розкоментувати, коли буде готова авторизація

    def perform_create(self, serializer):
        # Автоматично прив'язуємо оголошення до поточного користувача
        # заглушка/ беремо першого юзера, якщо авторизація ще не налаштована
        # В майбутньому замінити на: owner = UserClassfield.objects.get(user=self.request.user)
        try:
             #поки немає авторизації
            owner = UserClassfield.objects.first() 
            serializer.save(owner=owner)
        except:
            serializer.save()