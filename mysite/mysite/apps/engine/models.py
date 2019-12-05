from django.db import models

from django.contrib.auth.models import User
# Create your models here.
import os

SHARE_ROOT = '/home/jeff/Work/ShareRoot'


class Project(models.Model):
    name = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.name


class Pack(models.Model):
    name = models.CharField(max_length=256)
    officepriority = models.PositiveIntegerField(default=0)
    sohopriority = models.PositiveIntegerField(default=0)
    project = models.ForeignKey(
        Project, related_name="packs", on_delete=models.CASCADE)

    class Meta:
        unique_together = [['name', 'project']]

    def __str__(self):
        return self.name
        # return "{}: {}".format(self.id, self.name)


class WorkSpace(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pack = models.ForeignKey(Pack, on_delete=models.CASCADE)


class Batch(models.Model):
    name = models.CharField(max_length=256)
    pack = models.ForeignKey(Pack, on_delete=models.CASCADE, null=True)

    class Meta:
        unique_together = [['name', 'pack']]

    def __str__(self):
        return self.name


# class PackBatch(models.Model):
#     pack = models.ForeignKey(Pack, on_delete=models.CASCADE)
#     batch = models.ForeignKey(Batch, on_delete=models.CASCADE)


class Video(models.Model):
    folder = models.CharField(max_length=256)
    path = models.CharField(max_length=256)


class Task(models.Model):
    name = models.CharField(max_length=256)
    path = models.CharField(max_length=256)
    isfolder = models.BooleanField(default=False)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, null=True)

    class Meta:
        unique_together = [['name', 'batch']]

    def get_pack_from_path(self):
        return os.path.relpath(self.path, SHARE_ROOT).split('/')[2]


class Category(models.Model):
    text = models.CharField(max_length=256)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)


# class BatchTask(models.Model):
#     batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
#     task = models.ForeignKey(Task, on_delete=models.CASCADE)


class FrameStatus(models.Model):
    name = models.CharField(max_length=256)
    checked = models.BooleanField(default=False)
    defect = models.BooleanField(default=False)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
