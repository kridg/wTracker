from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    confirmPassword=serializers.CharField(write_only=True)

    class Meta:
        model=User
        fields=("id","username","email","password","confirmPassword")

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value
    
    def validate(self, data):
        if data["password"]!=data["confirmPassword"]:
            raise serializers.ValidationError({"password":"Passwords must match"})
        return data

    def create(self, validated_data):
        user=User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user