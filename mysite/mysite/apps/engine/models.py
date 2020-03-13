from django.db import models

from django.contrib.auth.models import User
# Create your models here.
import os

SHARE_ROOT = '/home/jeff/Work/ShareRoot'


class Project(models.Model):
    name = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.name


class ProjectUser(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Pack(models.Model):
    name = models.CharField(max_length=256)
    officepriority = models.PositiveIntegerField(default=0)
    sohopriority = models.PositiveIntegerField(default=0)
    sohopriority = models.PositiveIntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
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
    annotator = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    current = models.BooleanField(default=False)

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
    project = models.ForeignKey(Project, on_delete=models.CASCADE)


class Task(models.Model):
    name = models.CharField(max_length=256)
    path = models.CharField(max_length=256)
    isfolder = models.BooleanField(default=False)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, null=True)
    maxshape_id = models.BigIntegerField(default=0)

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


class Label(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    order = models.PositiveIntegerField(default=99)

    class Meta:
        unique_together = [['project', 'name']]


class AttributeSpec(models.Model):
    TYPE_CHOICES = (
        ('checkbox', 'checkbox'),
        # ('radio', 'radio'),
        ('text', 'text'),
        ('number', 'number'),
        ('select', 'select'),
        ('multiselect', 'multiselect'),
    )

    label = models.ForeignKey(Label, on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    mutable = models.BooleanField()
    attrtype = models.CharField(max_length=32, choices=TYPE_CHOICES)
    default_value = models.CharField(max_length=128, blank=True)
    values = models.CharField(max_length=4096, blank=True)
    order = models.PositiveIntegerField(default=99)

    class Meta:
        unique_together = [['label', 'name']]


class AttributeVal(models.Model):
    # BigAutoField
    id = models.BigAutoField(primary_key=True)
    spec = models.ForeignKey(AttributeSpec, on_delete=models.CASCADE)
    value = models.CharField(max_length=128)

    class Meta:
        abstract = True


class Annotation(models.Model):
    id = models.BigAutoField(primary_key=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    label = models.ForeignKey(Label, on_delete=models.CASCADE)
    frame = models.PositiveIntegerField()
    # group = models.PositiveIntegerField(null=True)

    class Meta:
        abstract = True


class Shape(models.Model):
    TYPE_CHOICES = (
        ('rectangle', 'rectangle'),
        ('polygon', 'polygon'),
        ('polyline', 'polyline'),
        ('points', 'points'),
    )
    # RECTANGLE = 'rectangle' # (x0, y0, x1, y1)
    # POLYGON = 'polygon'     # (x0, y0, ..., xn, yn)
    # POLYLINE = 'polyline'   # (x0, y0, ..., xn, yn)
    # POINTS = 'points'       # (x0, y0, ..., xn, yn)

    shapetype = models.CharField(max_length=32, choices=TYPE_CHOICES)
    # occluded = models.BooleanField(default=False)
    # z_order = models.IntegerField(default=0)
    # points = FloatArrayField()
    points = models.TextField()

    class Meta:
        abstract = True

# a shape has Annotation info (where from task & frame, and used label )


class LabeledShape(Annotation, Shape):
    shape_id = models.BigIntegerField()


# include all shape attr val
class LabeledShapeAttributeVal(AttributeVal):
    shape = models.ForeignKey(LabeledShape, on_delete=models.CASCADE)
