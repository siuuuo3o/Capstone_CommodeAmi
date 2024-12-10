from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = user.id
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class UserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs['pk']
        return generics.get_object_or_404(CustomUser, id=user_id)

##
class CheckUsernameAvailability(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        username = request.query_params.get('username')
        if CustomUser.objects.filter(username=username).exists():
            return Response({"message": "이미 사용 중인 아이디입니다."}, status=400)
        return Response({"message": "사용 가능한 아이디입니다."}, status=200)

##
##
# class CheckUsernameAvailability(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         username = request.query_params.get('username')
#         if CustomUser.objects.filter(username=username).exists():
#             return Response({"message": "이미 사용 중인 아이디입니다."}, status=status.HTTP_400_BAD_REQUEST)
#         return Response({"message": "사용 가능한 아이디입니다."}, status=status.HTTP_200_OK)
##


### smtp 테스트
# def signup(request):
#     if request.method == 'POST':
#         username = request.POST['username']
#         email = request.POST['email']
#         password = request.POST['password']
        
#         # CustomUser 모델을 사용하는 경우
#         user = CustomUser.objects.create_user(username=username, email=email, password=password)
#         user.is_active = False  # 계정을 비활성화 상태로 저장
#         user.save()

#         # 이메일 인증 링크 생성
#         current_site = get_current_site(request)
#         subject = 'Activate your account'
#         message = render_to_string('activation_email.html', {
#             'user': user,
#             'domain': current_site.domain,
#             'uid': urlsafe_base64_encode(force_bytes(user.pk)),
#             'token': default_token_generator.make_token(user),
#         })
#         send_mail(subject, message, EMAIL_HOST_USER, [email])  # 'your_email@example.com'을 EMAIL_HOST_USER로 대체
#         return HttpResponse('Please confirm your email address to complete the registration')

#     return render(request, 'signup.html')