from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator, MaxLengthValidator
from django.db import models

from users.models import UserClassfield
from categories.models import Category

class Classfield(models.Model):
    title = models.CharField(
        validators=[MinLengthValidator(3), MaxLengthValidator(20)]
    )
    description = models.CharField(
        validators=[MinLengthValidator(3), MaxLengthValidator(255)]
    )
    price = models.IntegerField(
        validators=[MinLengthValidator(1), MaxLengthValidator(1_000_000)]
    )
    date = models.DateTimeField(auto_now_add=True)
    photo = models.ImageField(upload_to='classfields/', null=True, blank=True)

    category = models.ForeignKey(
        Category,
        related_name="classfields",
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    owner = models.ForeignKey(
        UserClassfield,
        related_name="classfields",
        on_delete=models.CASCADE
    )

    def __str__ (self):
        return self.title