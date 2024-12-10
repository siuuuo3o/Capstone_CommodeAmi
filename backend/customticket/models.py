from django.db import models
from django.conf import settings

class CustomTicket(models.Model):
    custom_ticket_id = models.AutoField(primary_key=True)  # 기본 키로 AutoField 사용
    ticket_image = models.TextField()  # Base64로 저장되는 이미지 필드
    hologram_color1 = models.CharField(max_length=50, blank=True, null=True)  # 홀로그램 색상1
    hologram_color2 = models.CharField(max_length=50, blank=True, null=True)  # 홀로그램 색상2
    comment = models.CharField(max_length=500, blank=True, null=True)  # 코멘트 필드
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # User 모델을 가리킴
        on_delete=models.CASCADE,
        # related_name='custom_tickets'  # 관계 이름 설정 (선택사항)
    )

    def __str__(self):
        return f'Custom Ticket {self.custom_ticket_id} for User {self.user}'
