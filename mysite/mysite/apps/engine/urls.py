from django.urls import path, include
from rest_framework import routers

from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework_jwt.views import verify_jwt_token

from mysite.apps.engine.views import (ProjectViewSet, PackViewSet,
                                      VideoViewSet, BatchViewSet,
                                      ServerViewSet, TaskViewSet)

router = routers.DefaultRouter()
router.register('projects', ProjectViewSet)
router.register('packs', PackViewSet)
router.register('batchs', BatchViewSet)
router.register('tasks', TaskViewSet)
router.register('videos', VideoViewSet, basename='videos')
router.register('server', ServerViewSet, basename='server')


urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api-token-auth/', obtain_jwt_token),
    path('api-token-refresh/', refresh_jwt_token),
    path('api-token-verify/', verify_jwt_token),
    path('api/v1/', include((router.urls, 'mysite'), namespace='v1')),
]
