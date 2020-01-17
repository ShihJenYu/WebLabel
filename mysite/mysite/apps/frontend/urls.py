from django.urls import path, re_path
from mysite.apps.frontend import views

urlpatterns = [
    path('', views.index),
    path('project', views.index),
    path('pack', views.index),
    path('task', views.index),
    path('batch', views.index),
    path('video', views.index),
    path('login', views.index),
    path('logout', views.index),
    path('workplace/<str:project>', views.index),
    path('annotation', views.annotationView),
    # re_path(r'^\S', views.index2),
]
