from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CustomTokenObtainPairView, UserInfoView, UserDetailView, CheckUsernameAvailability
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('users/', UserInfoView.as_view(), name='user_info'),  # 사용자 정보 엔드포인트 추가
    # path('users/<int:user_id>/', UserDetailView.as_view(), name='user_detail'),
    path('info/', UserInfoView.as_view(), name='user_info'),  # 사용자 정보 엔드포인트 추가
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    path('check-username/', CheckUsernameAvailability.as_view(), name='check_username'),  # 아이디 중복 검사 엔드포인트 추가
]
