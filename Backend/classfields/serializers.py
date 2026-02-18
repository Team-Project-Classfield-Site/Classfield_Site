from rest_framework import serializers
from .models import Classfield
from categories.models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ClassfieldSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.title')
    owner_username = serializers.ReadOnlyField(source='owner.user.username')

    class Meta:
        model = Classfield
        fields = [
            'id', 'title', 'description', 'price', 
            'photo', 'date', 'category', 'category_name', 
            'owner', 'owner_username'
        ]