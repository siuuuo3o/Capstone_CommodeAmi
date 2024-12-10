from rest_framework import generics
from .models import CustomTicket
from .serializers import CustomTicketSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView

class CustomTicketListCreateView(ListCreateAPIView):
    serializer_class = CustomTicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id  # 현재 로그인된 사용자의 ID를 사용
        return CustomTicket.objects.filter(user_id=user_id)  # 사용자별 티켓 조회

class CustomTicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomTicket.objects.all()
    serializer_class = CustomTicketSerializer
    permission_classes = [IsAuthenticated]
    def perform_destroy(self, instance):
        if instance.user_id != self.request.user.id:
            return Response({"detail": "삭제 권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()

class UserCustomTicketsView(APIView):
    def get(self, request, user_id):
        tickets = CustomTicket.objects.filter(user_id=user_id)  # user_id로 필터링
        serializer = CustomTicketSerializer(tickets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)