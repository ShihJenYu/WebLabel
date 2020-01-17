from django.shortcuts import render
from mysite.apps.engine.models import Project
from django.db.models import Q
# Create your views here.


def index(request, project=None):
    print('index1')
    return render(request, 'frontend/index.html')


def error_404_view(request, exception):
    data = {"name": "MySite.com"}
    return render(request, 'frontend/error_404.html', data)


def annotationView(request):
    print('annotationView')
    return render(request, 'frontend/annotation.html')

# def index2(request):
#     print('index2')

#     LIST = list(Project.objects.all().values_list('name',flat=True))

#     if request.path_info.split('/')[1] in LIST:
#         return render(request, 'frontend/index.html')
#     else:
#         return render(request, 'frontend/error_404.html')
