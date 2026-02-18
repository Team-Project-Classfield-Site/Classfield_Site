from django.contrib.auth.models import User
from django.db import models

class UserClassfield(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="user_avatars/", blank=True, null=True)

    def __str__(self):
        return self.user.username