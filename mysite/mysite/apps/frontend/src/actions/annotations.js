import axios from 'axios';

import {
    GET_ANNOTATIONS, GET_LABELS, CHANGE_LABEL, SELECT_OBJECT, CHANGE_ATTR,
} from './types';

// GET PROJECTS
export const getAnnotations = () => (dispatch) => {
    console.log('in get annotations');
    axios
        .get('/api/v1/tasks/annotations')
        .then((res) => {
            dispatch({
                type: GET_ANNOTATIONS,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
};


// GET LABELS
export const getLabels = (id) => (dispatch) => {
    axios
        .get(`/api/v1/projects/${id}/labels/`)
        .then((res) => {
            dispatch({
                type: GET_LABELS,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
};


// CHANGE LABEL
export const changeLabel = (objID, labelID, attrs) => (dispatch) => {
    dispatch({
        type: CHANGE_LABEL,
        payload: { objID, labelID, attrs },
    });
};

// CHANGE Attr
export const changeAttr = (objID, attrID, attrValue) => (dispatch) => {
    dispatch({
        type: CHANGE_ATTR,
        payload: { objID, attrID, attrValue },
    });
};

export const selectObject = (id) => (dispatch) => {
    dispatch({
        type: SELECT_OBJECT,
        payload: { id },
    });
};