from django.urls import path
from mysite.apps.frontend import views

urlpatterns = [
    path('', views.index),
    path('project/', views.index),
    path('pack/', views.index),
    path('task/', views.index),
    path('batch/', views.index),
    path('video/', views.index),
]
