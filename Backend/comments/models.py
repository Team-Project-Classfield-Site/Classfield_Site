from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.db import models

from classfields import Classfield
from users import UserClassfield

class Comment(models.Model):
    text = models.CharField(
        validators=[MinLengthValidator(3), MaxLengthValidator(255)]
    )
    
    image = models.ImageField(
        upload_to="comment_image/",
        null=True,
        blank=True,
    )

    author = models.ForeignKey(
        UserClassfield,
        related_name="comments",
        on_delete=models.CASCADE
    )

    classfield = models.ForeignKey(
        Classfield,
        related_name="comments",      
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.author.username}: {self.classfield}"