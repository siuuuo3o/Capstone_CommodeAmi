from django.contrib import admin
from .models import Review
from django import forms

class ReviewAdminForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = '__all__'
    
    rating = forms.ChoiceField(
        choices=[(x / 2.0, str(x / 2.0)) for x in range(1, 11)],
        widget=forms.RadioSelect
    )

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('movie', 'user_nickname', 'rating', 'created_at')
    search_fields = ('user__nickname', 'user__username', 'movie__title')

    def user_nickname(self, obj):
        return obj.user.nickname if obj.user.nickname else obj.user.username
    user_nickname.short_description = 'User Nickname'

admin.site.register(Review, ReviewAdmin)
