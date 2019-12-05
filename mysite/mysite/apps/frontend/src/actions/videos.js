import axios from 'axios';

import { GET_VIDEOS, DELETE_VIDEO, ADD_VIDEO } from './types';

//GET VIDEOS
export const getVideos = () => dispatch => {
    axios
        .get('/api/v1/videos/')
        .then(res => {
            dispatch({
                type: GET_VIDEOS,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}


//DELETE VIDEO
export const deleteVideo = (id) => dispatch => {
    axios
        .delete(`/api/v1/videos/${id}/`)
        .then(res => {
            dispatch({
                type: DELETE_VIDEO,
                payload: id
            });
        })
        .catch(err => console.log(err));
}

//RENAME VIDEO
export const renam = (id) => dispatch => {
    axios
        .delete(`/api/v1/videos/${id}/`)
        .then(res => {
            dispatch({
                type: DELETE_VIDEO,
                payload: id
            });
        })
        .catch(err => console.log(err));
}

//ADD VIDEO
export const addVideo = (video) => dispatch => {
    axios
        .post('/api/v1/videos/', video)
        .then(res => {
            dispatch({
                type: ADD_VIDEO,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}
