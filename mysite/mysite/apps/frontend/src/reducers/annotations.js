import {
    GET_ANNOTATIONS, PATCH_ANNOTATIONS, GET_LABELS, CHANGE_LABEL, SELECT_OBJECT, CHANGE_ATTR,
    CHANGE_DEFAULTLABEL, CREATE_OBJECT, DELETE_OBJECT, SET_ACCORDION1BODYH, GET_FRAMESTATUS,
    SET_CURRENTFRAME, GET_INITDATA, UPDATE_OBJPOINT,
    CREATE_GROUP, DELETE_GROUP, SELECTE_GROUP, ADD_ITEM_TO_GROUP, SORTED_ITEM_TO_GROUP, RENAME_GROUP,
    HOVER_OBJECT,
} from '../actions/types';

const initialStata = {
    projectID: -1,
    annotations: [],
    labels: {},
    maxID: -1,
    selectedObject: {},
    defaultLabelID: null,
    accordion1BodyH: null,
    frameStatus: [{}],
    currentFrame: 0,

    hoverObjectID: '',
    groups: {}, //frame: [],
    selectedGroup: {}, // id, name,  [objIDs]

    initialed: false,
};

export default function (state = initialStata, action) {
    switch (action.type) {
        case GET_INITDATA:
            return {
                ...state,
                projectID: action.payload.project.id,
                labels: action.payload.labels,
                annotations: action.payload.annotations,
                maxID: action.payload.maxID,
                frameStatus: action.payload.frameStatus,
                defaultLabelID: +Object.keys(action.payload.labels)[0],
                initialed: true,
            };
        case GET_ANNOTATIONS:
            return {
                ...state,
                annotations: action.payload.annotations,
                maxID: action.payload.maxID,
            };
        case PATCH_ANNOTATIONS:
            console.log('PATCH_ANNOTATIONS', action.payload);
            return {
                ...state,
            };
        case GET_LABELS:
            console.log('haHA', action.payload);
            return {
                ...state,
                labels: action.payload.labelsData,
            };
        case GET_FRAMESTATUS:
            return {
                ...state,
                frameStatus: action.payload.frameStatus,
            };
        case CHANGE_LABEL:
            console.log('CHANGE_LABEL', action.payload);
            return {
                ...state,
                selectedObject: {
                    ...state.selectedObject,
                    label: action.payload.labelID,
                    attrs: action.payload.attrs,
                },
                annotations: state.annotations.map((object) => {
                    if (object.id === action.payload.objID) {
                        return {
                            ...object, label: action.payload.labelID, attrs: action.payload.attrs,
                        };
                    }
                    return object;
                }),
            };
        case CHANGE_ATTR: // objID, attrID, attrValue
            console.log('CHANGE_ATTR', action.payload);
            return {
                ...state,
                selectedObject: {
                    ...state.selectedObject,
                    attrs: {
                        ...state.selectedObject.attrs,
                        [action.payload.attrID]: action.payload.attrValue,
                    },
                },
                annotations: state.annotations.map((object) => {
                    if (object.id === action.payload.objID) {
                        return {
                            ...object,
                            attrs: {
                                ...object.attrs,
                                [action.payload.attrID]: action.payload.attrValue,
                            },
                        };
                    }
                    return object;
                }),
            };
        case SELECT_OBJECT: {
            console.log('SELECT_OBJECT', action.payload);
            const selected = state.annotations.find((item) => (item.id === action.payload.id));
            return {
                ...state,
                selectedObject: (selected) || {},
            };
        }
        case CHANGE_DEFAULTLABEL:
            return {
                ...state,
                defaultLabelID: action.payload.labelID,
            };
        case CREATE_OBJECT:
            return {
                ...state,
                annotations: [...state.annotations, action.payload.obj],
                selectedObject: action.payload.obj,
                maxID: state.maxID + 1,
            };
        case DELETE_OBJECT:
            return {
                ...state,
                annotations: state.annotations.filter((object) => object.id !== action.payload),
                selectedObject:
                    (state.selectedObject.id === action.payload) ? {} : state.selectedObject,
            };
        case SET_ACCORDION1BODYH:
            return {
                ...state,
                accordion1BodyH: action.payload,
            };
        case SET_CURRENTFRAME:
            return {
                ...state,
                currentFrame: action.payload,
                selectedObject: (state.currentFrame === action.payload) ? state.selectedObject : {},
                selectedGroup: (state.currentFrame === action.payload) ? state.selectedGroup : {},
            };
        case UPDATE_OBJPOINT: {
            const { annotations } = state;
            const {
                shapeIndex, points,
            } = action.payload;
            annotations[shapeIndex].points = points;
            return {
                ...state,
                annotations,
            };
        }
        case CREATE_GROUP: {
            const { groups } = state;
            const groupList = groups[state.currentFrame] || [];
            return {
                ...state,
                groups: { ...groups, [state.currentFrame]: [...groupList, action.payload.group] },
                selectedGroup: action.payload.group,
            };
        }
        case DELETE_GROUP: {
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [state.currentFrame]:
                        (state.groups[[state.currentFrame]]).filter((object) => object.id !== action.payload.id),
                },
                selectedGroup: (state.selectedGroup.id === action.payload.id)
                    ? {} : state.selectedGroup,
            };
        }
        case SELECTE_GROUP: {
            const select = (state.groups[state.currentFrame]).find((object) => object.id === action.payload.id);
            return {
                ...state,
                selectedGroup: (select) || {},
            };
        }
        case RENAME_GROUP: {
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [action.payload.frame]:
                        (state.groups[state.currentFrame]).map((group) => (
                            (group.id !== action.payload.group.id) ? group : action.payload.group)),
                },
            };
        }
        case ADD_ITEM_TO_GROUP: {
            const newGroup = {
                ...state.selectedGroup,
                objIDs: [...(state.selectedGroup.objIDs), action.payload.id],
            };
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [state.currentFrame]:
                        (state.groups[state.currentFrame]).map((group) => (
                            (group.id !== state.selectedGroup.id) ? group : newGroup)),
                },
                selectedGroup: newGroup,
            };
        }
        case SORTED_ITEM_TO_GROUP: {
            // const newGroup = {
            //     ...state.selectedGroup,
            //     objIDs: action.payload.selectedGroup,
            // };
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [state.currentFrame]:
                        (state.groups[state.currentFrame]).map((group) => (
                            (group.id !== state.selectedGroup.id) ? group : action.payload.selectedGroup)),
                },
                selectedGroup: action.payload.selectedGroup,
            };
        }
        case HOVER_OBJECT: {
            return {
                ...state,
                hoverObjectID: action.payload.id,
            };
        }
        default:
            return state;
    }
}
