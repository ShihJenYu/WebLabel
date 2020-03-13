import {
    GET_ANNOTATIONS, PATCH_ANNOTATIONS, GET_LABELS, CHANGE_LABEL, SELECT_OBJECT, CHANGE_ATTR,
    CHANGE_DEFAULTLABEL, CREATE_OBJECT, DELETE_OBJECT, SET_ACCORDION1BODYH,
} from '../actions/types';

const initialStata = {
    projectID: -1,
    annotations: [],
    labels: {},
    maxID: -1,
    selectedObject: {},
    defaultLabelID: null,
    accordion1BodyH: null,
};

export default function (state = initialStata, action) {
    switch (action.type) {
        case GET_ANNOTATIONS:
            return {
                ...state,
                projectID: action.payload.projectID,
                annotations: action.payload.data,
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
        case SELECT_OBJECT:
            console.log('SELECT_OBJECT', action.payload);
            return {
                ...state,
                selectedObject: state.annotations.find((item) => (item.id === action.payload.id)),
            };
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
        default:
            return state;
    }
}
