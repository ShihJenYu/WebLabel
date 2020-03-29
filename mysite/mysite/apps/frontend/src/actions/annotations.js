import axios from 'axios';

import {
    GET_ANNOTATIONS, PATCH_ANNOTATIONS, GET_LABELS, CHANGE_LABEL, SELECT_OBJECT, CHANGE_ATTR,
    CHANGE_DEFAULTLABEL, CREATE_OBJECT, DELETE_OBJECT, SET_ACCORDION1BODYH, GET_FRAMESTATUS,
    SET_CURRENTFRAME, GET_INITDATA, UPDATE_OBJPOINT,
} from './types';

// GET INITDATA
export const getINITDATA = (tid) => (dispatch) => {
    console.log('start get project');
    const data = {};
    axios
        .get(`/api/v1/tasks/${tid}/project/`)
        .then((res_p) => {
            data.project = res_p.data;
            console.log('start get labels');
            axios
                .get(`/api/v1/projects/${data.project.id}/labels/`)
                .then((res_l) => {
                    data.labels = res_l.data.labelsData;
                    console.log('start get annotations');
                    axios
                        .get(`/api/v1/tasks/${tid}/annotations/`)
                        .then((res_a) => {
                            data.annotations = res_a.data.annotations;
                            data.maxID = res_a.data.maxID;
                            console.log('start get framestatus');
                            axios
                                .get(`/api/v1/tasks/${tid}/framestatus/`)
                                .then((res_f) => {
                                    data.frameStatus = res_f.data.frameStatus;
                                    dispatch({
                                        type: GET_INITDATA,
                                        payload: data,
                                    });
                                    console.log('getINITDATA end');
                                })
                                .catch((err) => console.log(err));
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};


// GET ANNOTATIONS
export const getAnnotations = (id) => (dispatch) => {
    console.log('in get annotations');
    axios
        .get(`/api/v1/tasks/${id}/annotations/`)
        .then((res) => {
            dispatch({
                type: GET_ANNOTATIONS,
                payload: res.data,
            });
            console.log('getAnnotations end');
        })
        .catch((err) => console.log(err));
};

// PATCH ANNOTATIONS
export const patchAnnotations = (id, data) => (dispatch) => {
    console.log('in patch annotations');
    axios
        .patch(`/api/v1/tasks/${id}/annotations/`, data)
        .then((res) => {
            dispatch({
                type: PATCH_ANNOTATIONS,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
};

// GET LABELS
export const getLabels = (id) => (dispatch) => {
    console.log('in get labels');
    axios
        .get(`/api/v1/projects/${id}/labels/`)
        .then((res) => {
            dispatch({
                type: GET_LABELS,
                payload: res.data,
            });
            console.log('getLabels end');
        })
        .catch((err) => console.log(err));
};

// GET LABELS
export const getFrameStatus = async (id) => (dispatch) => {
    console.log('in get labels');
    axios
        .get(`/api/v1/tasks/${id}/framestatus/`)
        .then((res) => {
            dispatch({
                type: GET_FRAMESTATUS,
                payload: res.data,
            });
            console.log('getFrameStatus end');
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

// CHANGE DEFAULT LABEL
export const changeDefaultLabel = (labelID) => (dispatch) => {
    dispatch({
        type: CHANGE_DEFAULTLABEL,
        payload: { labelID },
    });
};

// SELECT OBJECT
export const selectObject = (id) => (dispatch) => {
    dispatch({
        type: SELECT_OBJECT,
        payload: { id },
    });
};

// CREATE OBJECT
export const createObject = (obj) => (dispatch) => {
    dispatch({
        type: CREATE_OBJECT,
        payload: { obj },
    });
};

// DELETE OBJECT
export const deleteObject = (id) => (dispatch) => {
    dispatch({
        type: DELETE_OBJECT,
        payload: id,
    });
};

// SET accordion1BodyH
export const setAccordion1BodyH = (h) => (dispatch) => {
    dispatch({
        type: SET_ACCORDION1BODYH,
        payload: h,
    });
};

// SET currentFrame
export const setCurrentFrame = (frame) => (dispatch) => {
    dispatch({
        type: SET_CURRENTFRAME,
        payload: frame,
    });
};

// update objPoint
export const updateObjPoint = (shapeIndex, points) => (dispatch) => {
    dispatch({
        type: UPDATE_OBJPOINT,
        payload: {
            shapeIndex, points,
        },
    });
};
