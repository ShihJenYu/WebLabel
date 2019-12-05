from django.urls import path, include
from rest_framework import routers
from mysite.apps.engine.views import (ProjectViewSet, PackViewSet,
                                      VideoViewSet, BatchViewSet,
                                      ServerViewSet)

router = routers.DefaultRouter()
router.register('projects', ProjectViewSet)
router.register('packs', PackViewSet)
router.register('batchs', BatchViewSet)
router.register('videos', VideoViewSet)
router.register('server', ServerViewSet, basename='server')


urlpatterns = [
    path('api/v1/', include((router.urls, 'mysite'), namespace='v1'))
]
