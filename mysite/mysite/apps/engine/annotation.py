from django.db import transaction
from . import models


@transaction.atomic
def get_task_data(pk, user):
    annotation = TaskAnnotation(pk, user)
    annotation.init_from_db()

    return annotation.data
    # temp = [{'id': 0, 'frame': 0, 'shapetype': 'rectangle', 'point': '10,10,50,50', 'label': 1, 'attrs': {'1': 'false', '2': '1'}},
    #         {'id': 1, 'frame': 0, 'shapetype': 'rectangle', 'point': '100,100,150,150',
    #             'label': 1, 'attrs': {'1': 'true', '2': '2'}},
    #         {'id': 2, 'frame': 0, 'shapetype': 'rectangle', 'point': '210,210,250,250',
    #             'label': 1, 'attrs': {'1': 'false', '2': '3'}},
    #         ]
    # return temp


def patch_task_data(pk, user, data):
    annotation = TaskAnnotation(pk, user)
    annotation.save_to_db(data)
    max_shapeID = annotation.update_max_shapeID

    return [annotation.data, max_shapeID]


class TaskAnnotation:
    def __init__(self, pk, user):
        self.user = user
        self.data = []
        self.db_task = models.Task.objects.get(id=pk)
        # self.db_labels = models.Project.objects.get(
        #     id=self.db_task.project_id).label_set.all()
        # print('db_labels', self.db_labels)

    def reset(self):
        self.data = []

    def clean(self):
        self.db_task.labeledshape_set.all().delete()

    def init_from_db(self):
        self.reset()
        shapes = self.db_task.labeledshape_set.all()
        for shape in shapes:
            data = {}
            attrs = shape.labeledshapeattributeval_set.all()
            data['id'] = shape.id
            data['frame'] = shape.frame
            data['shapetype'] = shape.shapetype
            data['points'] = shape.points
            data['label'] = shape.label_id
            data['shapeid'] = shape.shape_id
            data['attrs'] = {}
            for attr in attrs:
                data['attrs'][attr.spec_id] = attr.value
                print('hahaha', attr.value)
            self.data.append(data)

    def save_to_db(self, shapes):
        self.reset()
        self.clean()
        db_shapes = []
        db_attrvals = []

        for shape in shapes:
            attributes = shape.pop("attrs", [])
            db_shape = models.LabeledShape(
                task=self.db_task,
                # id=int(str(shape['id']).split('new_')[-1]),
                frame=shape['frame'],
                shapetype=shape['shapetype'],
                shape_id=int(str(shape['shapeid']).split('new_')[-1]),
                points=shape['points'],
                label_id=shape['label'],
            )

            #  if db_shape.label_id not in self.db_labels:
            #     raise AttributeError("label_id `{}` is invalid".format(db_shape.label_id))

            for attr in attributes:
                if isinstance(attributes[attr], list):
                    attributes[attr] = ';'.join(attributes[attr])
                print('hahaha', attributes[attr], type(attributes[attr]))
                db_attrval = models.LabeledShapeAttributeVal(
                    spec_id=attr,
                    value=attributes[attr]
                )
                # if db_attrval.spec_id not in self.db_attributes[db_shape.label_id]["all"]:
                #         raise AttributeError("spec_id `{}` is invalid".format(db_attrval.spec_id))
                db_attrval.shape_id = len(db_shapes)  # tmp id
                db_attrvals.append(db_attrval)

            db_shapes.append(db_shape)
            shape["attrs"] = attributes

        # TODO bulk create db_shapes
        db_shapes = models.LabeledShape.objects.bulk_create(db_shapes)

        # then db_shapes will have id, use for loop to assign shape_id to db_attrvals  (this shape_id is shape's pk not shape's shape_id)
        for db_attrval in db_attrvals:
            db_attrval.shape_id = db_shapes[db_attrval.shape_id].id

        # final bulk create db_attrvals
        db_attrvals = models.LabeledShapeAttributeVal.objects.bulk_create(
            db_attrvals)

        # use db_shapes'id to replace shapes'id
        for shape, db_shape in zip(shapes, db_shapes):
            shape["id"] = db_shape.id

        # return self.db_shapes
        self.data = shapes

    def update_max_shapeID(self):
        shape = self.db_task.labeledshape_set.all().order_by('-shape_id').first()
        self.db_task.maxshape_id = shape.shape_id
        self.db_task.save()
        return self.db_task.maxshape_id
