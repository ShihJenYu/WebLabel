from rest_framework import serializers

from mysite.apps.engine.models import (Project, Pack, WorkSpace,
                                       Batch, Video, Task, FrameStatus, Label, AttributeSpec)

# PackBatch,

import os
import glob
# from mysite.apps.engine import models


class FileInfoSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=4096)


class ProjectSerializer(serializers.ModelSerializer):
    # packs = serializers.StringRelatedField(many=True, required=False)
    class Meta:
        model = Project
        fields = '__all__'
        # fields = ('id', 'name', 'packs')


class PackSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(read_only=True, source='project.name')

    class Meta:
        model = Pack
        # fields = '__all__'
        fields = ('id', 'name', 'officepriority',
                  'sohopriority', 'project', 'project_name')


class WorkSpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSpace
        fields = '__all__'

# class PacKBatchSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = PackBatch
#         fields = '__all__'


class BatchSerializer(serializers.ModelSerializer):
    # pack = serializers.IntegerField(write_only=True, source='pack.id')

    class Meta:
        model = Batch
        # fields = '__all__'
        fields = ('id', 'name', 'pack', 'annotator', 'current')

    def create(self, validated_data):
        print(validated_data)
        # pack_data = validated_data.pop('pack')
        batch = Batch.objects.create(**validated_data)
        # packbatch = PackBatch.objects.create(
        #     pack_id=pack_data.get('id'), batch_id=batch.id)

        print(batch)
        return batch


class TaskSerializer(serializers.ModelSerializer):
    # pack = serializers.IntegerField(write_only=True, source='pack.id')
    batch_name = serializers.ReadOnlyField(source='batch.name')

    class Meta:
        model = Task
        fields = ('id', 'name', 'path', 'isfolder', 'video',
                  'batch', 'batch_name', 'maxshape_id')

        # fields = ('id', 'name', 'path', 'isfolder', 'video')


class VideoSerializer(serializers.ModelSerializer):
    # isFolder = serializers.BooleanField(
    #     write_only=True, source='task.isfolder')

    class Meta:
        model = Video
        fields = ('id', 'folder', 'path', 'project')
        # fields = '__all__'

    def create(self, validated_data):
        # print('create in serializer', validated_data,
        #       '**validated_data')
        task_data = validated_data.pop('task')
        isfolder = task_data['isfolder']

        video = Video.objects.create(**validated_data)
        # print('isfolder....', isfolder)

        # images = []
        # types = ('*.jpg', '*.png')  # the tuple of file types
        # for files in types:
        #     images.extend(glob.glob(os.path.join(
        #         validated_data['path'], files)))

        # if isfolder:
        #     # like apa, dms, one folder - one task - one user processs
        #     a_path = validated_data['path']
        #     basename = os.path.basename(a_path)
        #     task = Task.objects.create(name=basename, path=a_path,
        #                                isfolder=isfolder, video_id=video.id)
        #     tmp = []
        #     for img_path in images:
        #         basename = os.path.basename(img_path)
        #         tmp.append(FrameStatus(name=basename, task_id=task.id))
        #     frameStatuses = FrameStatus.objects.bulk_create(tmp)
        # else:
        #     tmp = []
        #     for a_path in images:
        #         basename = os.path.basename(a_path)
        #         filename = os.path.splitext(basename)[0]
        #         tmp.append(Task(name=filename, path=a_path,
        #                         isfolder=isfolder, video_id=video.id))
        #     tasks = Task.objects.bulk_create(tmp)

        #     tmp = []
        #     for task in tasks:
        #         basename = os.path.basename(task.path)
        #         tmp.append(FrameStatus(name=basename, task_id=task.id))
        #     frameStatuses = FrameStatus.objects.bulk_create(tmp)

        return video


class AttributeSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeSpec
        fields = '__all__'

    # def to_internal_value(self, data):
    #     attribute = data.copy()
    #     print('\n\n 1 to_internal_value', attribute)
    #     attribute['values'] = '\n'.join(
    #         map(lambda x: x.strip(), data.get('values', [])))
    #     print('\n\n 2 to_internal_value', attribute)
    #     return attribute

    # def to_representation(self, instance):
    #     if instance:
    #         attribute = super().to_representation(instance)
    #         print('\n\n 1 to_representation', attribute)
    #         attribute['values'] = attribute['values'].split('\n')
    #         print('\n\n 2 to_representation', attribute)
    #     else:
    #         attribute = instance
    #         print('\n\n 3 to_representation', attribute)

    #     return attribute


class LabelSerializer(serializers.ModelSerializer):
    attributes = AttributeSpecSerializer(many=True, source='attributespec_set',
                                         default=[], required=False)

    class Meta:
        model = Label
        # fields = '__all__'
        fields = ('id', 'name', 'project', 'order', 'attributes')


class FrameStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrameStatus
        fields = '__all__'
