import axios from 'axios';

import {
    GET_PROJECTS, DELETE_PROJECT, ADD_PROJECT, GET_PROJECT_PACKS, RENAME_PROJECT,
} from './types';

// GET PROJECTS
export const getProjects = () => (dispatch) => {
    axios
        .get('/api/v1/projects/')
        .then((res) => {
            dispatch({
                type: GET_PROJECTS,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
};


// DELETE PROJECT
export const deleteProject = (id) => (dispatch) => {
    axios
        .delete(`/api/v1/projects/${id}/`)
        .then(() => {
            dispatch({
                type: DELETE_PROJECT,
                payload: id,
            });
        })
        .catch((err) => console.log(err));
};


// RENAME PROJECT
export const renameProject = (id, project) => (dispatch) => {
    axios
        .patch(`/api/v1/projects/${id}/`, project)
        .then((res) => {
            dispatch({
                type: RENAME_PROJECT,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
};


// ADD PROJECT
export const addProject = (project) => (dispatch) => {
    axios
        .post('/api/v1/projects/', project)
        .then((res) => {
            dispatch({
                type: ADD_PROJECT,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
};

// GET PROJECT_PACKS
export const getProjectPacks = (id) => (dispatch) => {
    axios
        .get(`/api/v1/projects/${id}/packs`)
        .then((res) => {
            dispatch({
                type: GET_PROJECT_PACKS,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
};
