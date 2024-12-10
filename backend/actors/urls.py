from django.urls import path
from .views import ActorList, ActorDetail

urlpatterns = [
    path('', ActorList.as_view(), name='actor-list'),
    path('<int:pk>/', ActorDetail.as_view(), name='actor-detail'),
]
