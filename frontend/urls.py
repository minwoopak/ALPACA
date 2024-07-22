from django.urls import path
from .views import index, user_analysis, about

urlpatterns = [
    path('', index, name='frontend-index'),
    path('user_analysis/', user_analysis, name='user-analysis'),
    path('about/', about, name='frontend-about'),
]
