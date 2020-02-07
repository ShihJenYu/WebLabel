import {
    GET_ANNOTATIONS, GET_LABELS, CHANGE_LABEL, SELECT_OBJECT, CHANGE_ATTR,
} from '../actions/types';

const initialStata = {
    annotations: [],
    labels: {},
    selectedObject: {},
};

export default function (state = initialStata, action) {
    switch (action.type) {
        case GET_ANNOTATIONS:
            return {
                ...state,
                annotations: action.payload,
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
                selectedObject: { ...state.selectedObject, label: action.payload.labelID, attrs: action.payload.attrs },
                annotations: state.annotations.map((object) => {
                    if (object.id === action.payload.objID) {
                        return { ...object, label: action.payload.labelID, attrs: action.payload.attrs };
                    }
                    return object;
                }),
            };
        case CHANGE_ATTR: //objID, attrID, attrValue
            console.log('CHANGE_ATTR', action.payload);
            console.log({ ...state.selectedObject.attrs, [action.payload.attrID]: action.payload.attrValue });
            return {
                ...state,
                selectedObject: { ...state.selectedObject, attrs: { ...state.selectedObject.attrs, [action.payload.attrID]: action.payload.attrValue } },
                annotations: state.annotations.map((object) => {
                    if (object.id === action.payload.objID) {
                        return { ...object, attrs: { ...object.attrs, [action.payload.attrID]: action.payload.attrValue } };
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

        default:
            return state;
    }
}
