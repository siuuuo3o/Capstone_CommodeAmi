from django.urls import path
from .views import CustomTicketListCreateView, CustomTicketDetailView, UserCustomTicketsView

urlpatterns = [
    path('', CustomTicketListCreateView.as_view(), name='customticket-list-create'),
    path('<int:pk>/', CustomTicketDetailView.as_view(), name='customticket-detail'),
    path('user/<int:user_id>/', UserCustomTicketsView.as_view(), name='customticket-user-list'),  # 사용자별 티켓 조회
]
