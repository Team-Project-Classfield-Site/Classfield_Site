from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.db import models

class Category(models.Model):
    title = models.CharField(
        validators=[MinLengthValidator(3), MaxLengthValidator(20)]
    )

    def __str__ (self):
        return self.title