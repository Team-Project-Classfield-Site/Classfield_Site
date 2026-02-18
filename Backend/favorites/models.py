from django.db import models
from classfields.models import Classfield
from users.models import UserClassfield

class Favorite(models.Model):
    user = models.ForeignKey(
        UserClassfield,
        related_name="favorites",
        on_delete=models.CASCADE
    )
    
    classfield = models.ForeignKey(
        Classfield,
        related_name="favorites",
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.user.username}: {self.classfield}"