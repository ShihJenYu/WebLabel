# from django.shortcuts import render
# Create your views here.

from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from django_filters import rest_framework as filters

from mysite.apps.engine.models import Project, Pack, Batch, Video, Task
from mysite.apps.engine.serializers import (ProjectSerializer, PackSerializer,
                                            BatchSerializer, VideoSerializer,
                                            FileInfoSerializer)


import os
import glob
import time
import json

SHARE_ROOT = '/home/jeff/Work/ShareRoot'


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    # url : projects/pk/packs
    @action(detail=True, methods=['GET'], serializer_class=PackSerializer)
    def packs(self, request, pk):
        self.get_object()
        queryset = Pack.objects.filter(project_id=pk)
        serializer = PackSerializer(
            queryset, many=True, context={"request": request})

        return Response(serializer.data)


class PackViewSet(viewsets.ModelViewSet):
    queryset = Pack.objects.all()
    serializer_class = PackSerializer


class BatchFilter(filters.FilterSet):
    pack = filters.NumberFilter(field_name="pack__id", lookup_expr='exact', distinct=True)

    class Meta:
        model = Batch
        fields = ['pack']


class BatchViewSet(viewsets.ModelViewSet):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = BatchFilter


def checkDir(path):
    list_dir = glob.glob(os.path.join(path, '*'))
    if len(list_dir) == 0:
        return False
    for d in list_dir:
        if os.path.isdir(d):
            return False
    print('ok...', path)
    return True


class VideoFilter(filters.FilterSet):
    project = filters.NumberFilter(field_name="task__batch__pack__project__id", lookup_expr='exact', distinct=True)
    pack = filters.NumberFilter(field_name="task__batch__pack__id", lookup_expr='exact', distinct=True)
    ids = filters.NumberFilter(field_name="id", lookup_expr='exact', distinct=True)

    class Meta:
        model = Video
        fields = ['project', 'pack']


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = VideoFilter

    # TODO: check user permission and in group to get match videos, 
    #       then delete queryset in first line
    # def get_queryset(self):
    #     user = self.request.user

    # overwrite creat for multi object in one request
    def create(self, request, *args, **kwargs):
        print('create in viewset')
        time_A = time.time()

        selectFolders = request.data['checkedFolders']
        isFolder = request.data['folderMode']
        data = []
        # process checkedfolderpath
        for path in selectFolders:
            if path.startswith("/"):
                path = path[1:]
            full_path = os.path.abspath(os.path.join(SHARE_ROOT, path))
            folder = os.path.basename(full_path)

            if checkDir(full_path):
                data.append({"folder": folder,
                             "path": full_path,
                             "isFolder": isFolder})
        time_B = time.time()
        print("now", data)
        print("prepare cost time...", time_B-time_A, 's')
        serializer = self.get_serializer(
            data=data, many=isinstance(data, list))
        if serializer.is_valid(raise_exception=True):
            print('before perform_create')
            self.perform_create(serializer)
            print('after perform_create')
            time_C = time.time()
            print("final cost time...", time_C-time_B, 's')
            headers = self.get_success_headers(serializer.data)

            # print(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED,
                            headers=headers)


class ServerViewSet(viewsets.ViewSet):
    serializer_class = None
    # To get nice documentation about ServerViewSet actions it is necessary
    # to implement the method. By default, ViewSet doesn't provide it.

    def get_serializer(self, *args, **kwargs):
        pass

    @staticmethod
    @action(detail=False, methods=['GET'])
    def share(request):
        param = request.query_params.get('directory', '/')
        if param.startswith("/"):
            param = param[1:]
        directory = os.path.abspath(os.path.join(SHARE_ROOT, param))
        print('directory', directory)
        if directory.startswith(SHARE_ROOT) and os.path.isdir(directory):
            data = []
            content = os.scandir(directory)
            for entry in content:
                # entry_type = None
                if entry.is_dir():
                    # entry_type = "DIR"
                    data.append({"name": entry.name})

                # if entry_type:
                #     data.append({"name": entry.name, "type": entry_type})
            print('data', data)
            serializer = FileInfoSerializer(many=True, data=data)
            if serializer.is_valid(raise_exception=True):
                return Response(serializer.data)
            # print(serializer.data)
        else:
            return Response("{} is an invalid directory".format(param),
                            status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    @action(detail=False, methods=['POST'])
    def upload(request):
        params = request.POST.dict()
        action = params['action']

        if action == 'assign_tasks':

            file_list = request.FILES.getlist('file')
            data_content = ''
            for chunk in file_list[0].chunks():
                data_content += chunk.decode('utf-8')

            dictGrouping = json.loads(data_content)
            data_list = dictGrouping['data']
            for data in data_list:
                project = data['project']
                pack = data['pack']
                batch_dict = data['batch']
                print('--------------------------', project, pack)

                # check pack
                pack_qs = Pack.objects.filter(name=pack, project__name=project)
                if len(pack_qs) > 0:
                    if len(pack_qs) == 1:
                        pack_qs = pack_qs[0]
                    else:
                        print('error Pack.objects.filter has >1 data')
                        return Response('error Pack has >1 data')
                else:
                    # create project then create pack (priority: 0, 0)
                    project_qs, create = Project.objects.get_or_create(
                        name=project)
                    pack_qs = Pack.objects.create(
                        name=pack, project=project_qs)

                for batch_name in batch_dict:
                    # check batch
                    batch_qs = Batch.objects.filter(
                        name=batch_name, pack=pack_qs)
                    if len(batch_qs) > 0:
                        if len(batch_qs) == 1:
                            batch_qs = batch_qs[0]
                        else:
                            print('error Batch.objects.filter has >1 data')
                            return Response('error Batch has >1 data')
                    else:
                        # create batch
                        batch_qs = Batch.objects.create(
                            name=batch_name, pack=pack_qs)

                    # update task's batch
                    task_names = batch_dict[batch_name]
                    print('task_names',task_names)
                    update_task_ids = []
                    for task_qs in Task.objects.filter(name__in=task_names):
                        print('task_qs.get_pack_from_path()',task_qs.get_pack_from_path())
                        if task_qs.get_pack_from_path() == pack_qs.name:
                            update_task_ids.append(task_qs.id)
                    print('----',update_task_ids)
                    Task.objects.filter(
                        id__in=update_task_ids).update(batch=batch_qs)

        return Response(request.data)
