# from django.shortcuts import render
# Create your views here.

from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from django_filters import rest_framework as filters

from django.db.models import Q
from django.contrib.auth.models import Permission, User

from mysite.apps.engine.models import Project, Pack, Batch, Video, Task, WorkSpace, ProjectUser, Label, AttributeSpec
from mysite.apps.engine.serializers import (ProjectSerializer, PackSerializer,
                                            BatchSerializer, VideoSerializer,
                                            FileInfoSerializer, TaskSerializer,
                                            WorkSpaceSerializer, LabelSerializer,
                                            AttributeSpecSerializer)


import os
import glob
import time
import json

SHARE_ROOT = '/home/jeff/Work/ShareRoot'


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ProjectSerializer

    # url : projects/pk/packs
    @action(detail=True, methods=['GET'], serializer_class=PackSerializer)
    def packs(self, request, pk):
        self.get_object()
        queryset = Pack.objects.filter(project_id=pk)
        serializer = PackSerializer(
            queryset, many=True, context={"request": request})

        return Response(serializer.data)

    @action(detail=True, methods=['GET', 'POST'])
    def users(self, request, pk):
        # self.get_object()
        if request.method == 'GET':
            data = {}
            data['in'] = list(ProjectUser.objects.filter(
                project_id=pk).values_list('user__username', flat=True))
            data['all'] = list(
                User.objects.all().values_list('username', flat=True))
            return Response(data)
        elif request.method == 'POST':
            data = {}
            print(request.data)
            print(request.data['selected'])

            selected_users = request.data['selected']

            ProjectUser.objects.filter(Q(project_id=pk) & ~Q(
                user__username__in=selected_users)).delete()

            for username in selected_users:
                user = User.objects.filter(username=username).first()
                if user:
                    obj, created = ProjectUser.objects.get_or_create(
                        project_id=pk, user=user)
                    print(username, 'created:', created)
                    data[username] = created

            return Response(data)

    @action(detail=True, methods=['GET', 'POST'], serializer_class=BatchSerializer)
    def batch(self, request, pk):

        access = ProjectUser.objects.filter(
            Q(user=request.user) & Q(project_id=pk)).exists()
        if not access:
            return Response("you cannot access this project, should contact the administrator", status=status.HTTP_400_BAD_REQUEST)

        packs = WorkSpace.objects.filter(Q(user=request.user) & ~Q(pack__officepriority=0) & Q(
            pack__project_id=pk)).order_by('-pack__officepriority', 'pack__created_date').values_list('pack', flat=True).distinct()
        # current_pack = data.pack
        print('packs', packs)

        batch = Batch.objects.filter(Q(pack__in=packs) & Q(
            annotator=request.user) & Q(current=True)).first()

        if request.method == 'POST':
            # ask new batch
            if batch:
                return Response("you have current batch in this project, should use get method", status=status.HTTP_400_BAD_REQUEST)
            else:
                newBatch = None
                for pack in packs:
                    batch = Batch.objects.filter(Q(pack=pack) & Q(
                        annotator=None)).order_by('name').first()
                    if batch:
                        break
                if not batch:
                    return Response("vacant batch was not found in packs", status=status.HTTP_400_BAD_REQUEST)
                batch.annotator = request.user
                batch.current = True
                batch.save()
                serializer = BatchSerializer(batch)

                tasks = Task.objects.filter(batch=batch)
                serializer2 = TaskSerializer(
                    tasks, many=True, context={"request": request})

                return Response({'batch': serializer.data, 'tasks': serializer2.data})

        elif request.method == 'GET':
            # get current batch
            if batch:
                serializer = BatchSerializer(batch)

                tasks = Task.objects.filter(batch=batch)
                serializer2 = TaskSerializer(
                    tasks, many=True, context={"request": request})

                return Response({'batch': serializer.data, 'tasks': serializer2.data})
            else:
                return Response("you have not any batch in this pack, should use post method", status=status.HTTP_400_BAD_REQUEST)


class PackViewSet(viewsets.ModelViewSet):
    queryset = Pack.objects.all()
    serializer_class = PackSerializer

    @action(detail=True, methods=['GET', 'POST'])
    def users(self, request, pk):
        # self.get_object()
        if request.method == 'GET':
            data = {}
            data['in'] = list(WorkSpace.objects.filter(
                pack_id=pk).values_list('user__username', flat=True))
            data['all'] = list(
                User.objects.all().values_list('username', flat=True))
            return Response(data)
        elif request.method == 'POST':
            data = {}
            print(request.data)
            print(request.data['selected'])

            selected_users = request.data['selected']

            WorkSpace.objects.filter(Q(pack_id=pk) & ~Q(
                user__username__in=selected_users)).delete()

            for username in selected_users:
                user = User.objects.filter(username=username).first()
                if user:
                    obj, created = WorkSpace.objects.get_or_create(
                        pack_id=pk, user=user)
                    print(username, 'created:', created)
                    data[username] = created

            return Response(data)


class BatchFilter(filters.FilterSet):
    pack = filters.NumberFilter(
        field_name="pack__id", lookup_expr='exact', distinct=True)

    class Meta:
        model = Batch
        fields = ['pack']


class BatchViewSet(viewsets.ModelViewSet):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = BatchFilter

    @action(detail=True, methods=['POST'])
    def send(self, request, pk):
        # TODO check is owner or admin
        batch = Batch.objects.get(pk=pk)

        if request.user.is_superuser or request.user == batch.annotator:
            batch.current = False
            batch.save()
            serializer = BatchSerializer(batch)
            return Response(serializer.data)
        else:
            return Response("you are not owner of the batch", status=status.HTTP_400_BAD_REQUEST)


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
    project = filters.NumberFilter(
        field_name="task__batch__pack__project__id", lookup_expr='exact', distinct=True)
    pack = filters.NumberFilter(
        field_name="task__batch__pack__id", lookup_expr='exact', distinct=True)
    ids = filters.NumberFilter(
        field_name="id", lookup_expr='exact', distinct=True)

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
            return Response(serializer.data, status=
            status.HTTP_201_CREATED,
                            headers=headers)
    @action(detail=False, methods=['GET'])
    def annotations(self, request):
        print('sssss')

        data = [{ 'name': 'firstobj', 'type': 'car', 'id': 0 },
                 { 'name': 'secondobj', 'type': 'bike', 'id': 1 },
                 { 'name': 'thirdobj', 'type': 'people', 'id': 2 },]
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED,
                            headers=headers)


class TaskFilter(filters.FilterSet):
    batch = filters.NumberFilter(
        field_name="batch__id", lookup_expr='exact', distinct=True)

    class Meta:
        model = Task
        fields = ['batch']


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = TaskFilter


class LabelFilter(filters.FilterSet):
    project = filters.NumberFilter(
        field_name="project__id", lookup_expr='exact', distinct=True)

    class Meta:
        model = Label
        fields = ['project']


class LabelViewSet(viewsets.ModelViewSet):
    queryset = Label.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = LabelSerializer
    filter_class = LabelFilter
    ordering_fields = ['order']
    ordering = ['order']

    @action(detail=False, methods=['POST'])
    def createWithAttrSpec(self, request):
        params = request.data
        srcLabel = params['label']
        srcAttributespecs = params['attributespecs']
        print('createWithAttrSpec', srcLabel, srcAttributespecs)

        label = Label.objects.create(name=srcLabel['name'], project_id=srcLabel['project'])
        
        attributeSpecList = []
        for srcAttributespec in srcAttributespecs:
            attributeSpecList.append(AttributeSpec(name=srcAttributespec['name'],
                                                mutable=srcAttributespec['mutable'],
                                                attrtype=srcAttributespec['attrtype'],
                                                default_value=srcAttributespec['default_value'],
                                                values=srcAttributespec['values'],
                                                order=srcAttributespec['order'],
                                                label=label))

        attributespecs = AttributeSpec.objects.bulk_create(attributeSpecList)

        serializer = LabelSerializer(label, many=True, context={"request": request})


        labels = Label.objects.filter(project_id=srcLabel['project'])
        serializer1 = LabelSerializer(labels, many=True, context={"request": request})
        serializer2 = AttributeSpecSerializer(attributespecs, many=True, context={"request": request})

        print('label', labels,serializer1.data)
        print('attributespecs', attributespecs,serializer2.data)
        
        return Response({'label':serializer.data, 'attributespecs':serializer2.data})


class AttributeSpecFilter(filters.FilterSet):
    label = filters.NumberFilter(
        field_name="label__id", lookup_expr='exact', distinct=True)

    class Meta:
        model = AttributeSpec
        fields = ['label']


class AttributeSpecViewSet(viewsets.ModelViewSet):
    queryset = AttributeSpec.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = AttributeSpecSerializer
    filter_class = AttributeSpecFilter
    ordering_fields = ['order']
    ordering = ['order']



class ServerViewSet(viewsets.ViewSet):
    serializer_class = None
    # To get nice documentation about ServerViewSet actions it is necessary
    # to implement the method. By default, ViewSet doesn't provide it.

    def get_serializer(self, *args, **kwargs):
        pass

    @staticmethod
    @action(detail=False, methods=['GET'])
    def workplace(request):
        data = {}
        data['name'] = request.user.username
        projects = list(ProjectUser.objects.filter(
            Q(user=request.user)).values('project__id', 'project__name').distinct())
        # projects = list(WorkSpace.objects.filter(Q(user=request.user)).values_list('pack__project__name', flat=True).distinct())

        projects = [{'id': p['project__id'], 'name': p['project__name']}
                    for p in projects]

        print('projects', projects)
        if request.user.is_superuser:
            data['permission'] = 'admin'
            return Response(data)
        else:
            # projects = list(WorkSpace.objects.filter(Q(user=request.user)).values_list('pack__project__name', flat=True).distinct())
            data['permission'] = 'normal'
            data['projects'] = sorted(
                projects, key=lambda k: k['name'])
            return Response(data)

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
                    print('task_names', task_names)
                    update_task_ids = []
                    for task_qs in Task.objects.filter(name__in=task_names):
                        print('task_qs.get_pack_from_path()',
                              task_qs.get_pack_from_path())
                        if task_qs.get_pack_from_path() == pack_qs.name:
                            update_task_ids.append(task_qs.id)
                    print('----', update_task_ids)
                    Task.objects.filter(
                        id__in=update_task_ids).update(batch=batch_qs)

        return Response(request.data)
