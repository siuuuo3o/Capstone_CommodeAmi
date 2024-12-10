from rest_framework import serializers
from .models import CustomTicket

class CustomTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomTicket
        fields = '__all__'
